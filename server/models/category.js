const mongoose = require("mongoose")

const categorySchema = mongoose.Schema({
    name: {type: String, required: true}
})

const Category = mongoose.models.category || mongoose.model("category", categorySchema)

module.exports = Category