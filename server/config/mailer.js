const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: process.env.SMTP,
    port: 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

transporter.verify((error, success) => {
    if(error){
        console.log("Error verifying SMTP config: ", error)
    }else{
        console.log("SMTP config is valid")
    }
})

module.exports = transporter