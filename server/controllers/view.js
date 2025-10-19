const Views = require("../models/view")

const viewCount = async(req,res) => {
    try {
        const views = await Views.countDocuments()
        return res.json({success: true, msg: views})
    } catch (error) {
        return res.json({msg: error.message})
    }
}

module.exports = {viewCount}