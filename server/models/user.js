const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verificationOTP: {type: String, default: ""},
    verificationOTPExpiresAt: {type: Number, default: 0},
    resetOTP: {type: String, default: ""},
    resetOTPExpiresAt: {type: Number, default: 0},
    isVerified: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false}
}, {timestamps: true})

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.verificationOTP;
  delete obj.resetOTP;
  return obj;
};


const user = mongoose.models.user || mongoose.model('user', userSchema)

module.exports = user