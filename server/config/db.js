const mongoose = require("mongoose")


async function connectDB(){
    try {
        mongoose.connection.on("connected", () => {
            console.log("mongodb is connected!")
        })

        mongoose.connection.on("error", err => {
            console.error("Mongoose connection error: ", err)
        })

        await mongoose.connect(process.env.MONGODB_URL)
        
    } catch (error) {
     console.log(error)   
    }
}

module.exports = connectDB;