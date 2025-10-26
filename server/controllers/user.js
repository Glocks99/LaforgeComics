const user = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {sendEmail} = require("../config/mailer.js")
const { welcomeTemplate, verifyOtpTemplate } = require("../utils/Templates/welcome.js")


const register = async(req,res) => {
    const {firstName, lastName, email, phone, password} = req.body
    try {
        const exitsingUser = await user.findOne({$or: [{email},{phone}]})

        if(exitsingUser){
            return res.json({success: false, msg: "User or Contact already exists!"})
        }

        const newUser = new user({
            firstName,
            lastName,
            email,
            phone,
            password: await bcrypt.hash(password, 10),
            isAdmin: false
        })

        await newUser.save()

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '24h'})

        res.cookie("comicsToken", token, {
            http: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
            maxAge: 24 * 60 * 60 * 1000
        })

        const template = welcomeTemplate
        .replace("{{firstName}}", newUser.firstName)
        .replace("{{currentYear}}", new Date().getFullYear());

        await sendEmail({
            to: newUser.email,
            subject: "Welcome to LaForge Comics",
            html: template
        })

        return res.json({success: true, msg: "registration successful"})
    } catch (error) {
        console.log(error)
        return res.json({success: false, msg: error.message})
    }
}

const login = async(req,res) => {
    const {email, password} = req.body
    try {
        const User = await user.findOne({email})

        if(!User){
            return res.json({success: false, msg: "user not found!"})
        }

        const isMatch = await bcrypt.compare(password, User.password)

        if(!isMatch){
            return res.json({success: false, msg: "password is incorrect"})
        }

        const token = jwt.sign({id: User._id}, process.env.JWT_SECRET, {expiresIn: '24h'})

        res.cookie("comicsToken", token, {
            http: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.json({success: true, msg: "Login successful", user: {
            firstName: User.firstName,
            lastName: User.lastName,
            phone: User.phone,
            email: User.email,
            isVerified: User.isVerified,
            isAdmin: User.isAdmin,
            id: User._id
        }})

    } catch (error) {
        console.log(error)
        return res.json({success: false, msg: error.message})
    }
}

const logout = async(req,res) => {
    try {
        res.clearCookie("comicsToken", {
            http: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
            maxAge: 0
        })

        return res.json({success: true, msg: "Logout succesfull"})
    } catch (error) {
        console.log(error)
        return res.json({success: false, msg: error.message})
    }
}

const sendVerificationOTP = async(req,res) => {
    const {id} = req.user

    if(!id){
        return res.json({success: false, msg: "Unauthorized! login again"})
    }

    try {
        const User = await user.findById(id)

        if(!User){
            return res.json({success: false, msg: "Account not found! login again"})
        }

        if(User.isVerified === "true"){
            return res.json({success: false, msg: "Account already verified!"})
        }

        const OTP = String(Math.round(100000 + Math.random() * 900000))

        const mailOptions = {
            to: User.email,
            subject: "Verify Email",
            html: verifyOtpTemplate
            .replace("{{title}}", "Email Verification Code")
            .replace("{{firstName}}", User.firstName)
            .replace("{{otpCode}}", OTP)
            .replace("{{currentYear}}", "2025")
        }

        await sendEmail(mailOptions)

        User.verificationOTP = OTP
        User.verificationOTPExpiresAt = Date.now() + 2 * 60 * 60 *1000

        await User.save();

        return res.json({success: true, msg: "OTP sent to email"})
    } catch (error) {
        return res.json({success: false, msg: error.message})
    }
}

const verifyOTP = async(req,res) => {
    const {otp} = req.body
    const {id} = req.user

    if(!otp){
        return res.json({success: false, msg: "otp is required"})
    }

    try {
        const User = await user.findById(id)

        if(!User){
            return res.json({success: false, msg: "not authorized! login again"})
        }

        if(User.verificationOTP === "" || User.verificationOTP !== otp){
            return res.json({success: false, msg: "Incorrect OTP"})
        }

        if(User.verificationOTPExpiresAt < Date.now()){
            return res.json({success: false, msg: "OTP Expired!"})
        }

        User.isVerified = true
        User.verificationOTP = ""
        User.verificationOTPExpiresAt = 0

        await User.save()

        return res.json({success: true, msg: "Account verified!", user: {
            firstName: User.firstName,
            lastName: User.lastName,
            phone: User.phone,
            email: User.email,
            isVerified: User.isVerified
        }})
    } catch (error) {
        return res.json({success: false, msg: error.message})
    }
}

const sendResetOTP = async(req,res) => {
    const {email} = req.body

    if(!email){
        return res.json({success: false, msg: "Email is required!"})
    }

    try {
        const User = await user.findOne({email})

        if(!User){
            return res.json({success: false, msg: "Account not found!"})
        }

        const OTP = String(Math.round(100000 + Math.random() * 900000))

        const mailOptions = {
            to: User.email,
            subject: "Reset Password OTP",
            html: verifyOtpTemplate
            .replace("{{title}}", "Reset Password OTP")
            .replace("{{firstName}}", User.firstName)
            .replace("{{otpCode}}", OTP)
            .replace("{{currentYear}}", "2025")
        }

        await sendEmail(mailOptions)

        User.resetOTP = OTP
        User.resetOTPExpiresAt = Date.now() + 2 * 60 * 60 *1000

        await User.save();

        return res.json({success: true, msg: "Reset password OTP sent to email"})
    } catch (error) {
        return res.json({success: false, msg: error.message})
    }
}

const checkResetOTP = async(req,res) => {
    const {email, otp} = req.body

    if(!email || !otp){
        return res.json({success: false, msg: "OTP is required!"})
    }
    
    try {
        const User = await user.findOne({email})

        if(!User){
            return res.json({success: false, msg: "Account not found!"})
        }

        if(User.resetOTP === "" || User.resetOTP !== otp){
            return res.json({success: false, msg: "Incorrect OTP"})
        }

        if(User.resetOTPExpiresAt < Date.now()){
            return res.json({success: false, msg: "OTP Expired!"})
        }

        User.resetOTP = ""
        User.resetOTPExpiresAt = 0
        
        await User.save()

        return res.json({success: true, msg: "OTP Is Valid"})
    } catch (error) {
        return res.json({success: false, msg: error.message})
    }
}

const resetPassword = async(req,res) => {
    const {email, newPassword} = req.body

    if(!email || !newPassword){
        return res.json({success: false, msg: "input fields are required"})
    }

    try {
        const User = await user.findOne({email})

        if(!User){
            return res.json({success: false, msg: "Account not found!"})
        }

        User.password = await bcrypt.hash(newPassword, 10)

        await User.save()

        return res.json({success: true, msg: "Password Change Successful"})
    } catch (error) {
        return res.json({success: false, msg: error.message})
    }
}

const getAllUsers = async(req,res) => {
    try {
        const users = await user.find().select("-resetOTPExpiresAt -verificationOTPExpiresAt")

        if(!users){
            return res.json({success: false, msg: "No users found"})
        }

        return res.json({success: true, users})
    } catch (error) {
        return res.json({success: false, msg: error.message})
    }
}

const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, isAdmin, isVerified, oldPassword, newPassword } = req.body;
    const { id } = req.params;

    const account = await user.findById(id);
    if (!account) {
      return res.json({ success: false, msg: "User not found" });
    }

    if (oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword, account.password);
      if (!isMatch) {
        return res.json({ success: false, msg: "Old password is incorrect" });
      }

      if (newPassword) {
        const salt = await bcrypt.genSalt(10);
        account.password = await bcrypt.hash(newPassword, salt);
      }
    }

    account.firstName = firstName || account.firstName;
    account.lastName = lastName || account.lastName;
    account.email = email || account.email;
    account.phone = phone || account.phone;
    if (typeof isAdmin !== "undefined") account.isAdmin = isAdmin;
    if (typeof isVerified !== "undefined") account.isVerified = isVerified;

    await account.save();

    return res.json({
      success: true,
      msg: "User updated successfully",
      user: {
        id: account._id,
        firstName: account.firstName,
        lastName: account.lastName,
        phone: account.phone,
        email: account.email,
        isAdmin: account.isAdmin,
        isVerified: account.isVerified,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.json({ success: false, msg: "Server error", error: error.message });
  }
};

const deleteUser = async(req,res) => {
    const {id} = req.params
    try {
        const account = await user.findByIdAndDelete(id)

        if(!account){
            return res.json({success: false, msg: "cant delete user"})
        }

        return res.json({success: true, msg: "user deleted succesfully"})
    } catch (error) {
        return res.json({success: false, msg: error.message})
    }
}

const getUserCount = async(req,res) => {
    try {
        const users = await user.find().countDocuments()

        if(!users){
            return res.json({success: false, msg: "cannot get users count"})
        }

        return res.json({success: true, msg: users})
    } catch (error) {
        return res.json({success: false, msg: error.message})
    }
}


module.exports = 
{
    register,
    login,
    logout,
    sendVerificationOTP,
    sendResetOTP,
    verifyOTP,
    checkResetOTP,
    resetPassword,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserCount
}