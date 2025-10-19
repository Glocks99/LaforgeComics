const router = require("express").Router()
const { register, login, logout, sendVerificationOTP, sendResetOTP,getUserCount, verifyOTP, checkResetOTP, resetPassword, getAllUsers,updateUser, deleteUser } = require("../controllers/user.js")
const { verify } = require("../middlewares/authVerify.js")


router.get("/", getAllUsers)
router.get("/count", getUserCount )
router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.post("/verify-otp", verify, verifyOTP)
router.post("/send-veri-otp", verify, sendVerificationOTP)
router.post("/send-reset-otp", sendResetOTP)
router.post("/check", checkResetOTP)
router.post("/reset-password", resetPassword)
router.put("/:id", updateUser)
router.delete("/:id", deleteUser)

module.exports = router