const mongoose = require("mongoose")

const blogsSchema = mongoose.Schema({
    title: {type: String, required: true},
    image: {type: String, required: true},
    excerpt: {type: String, required: true},
    author: {type: String, required: true},
    tags: {type: [String], required: true},
    body: {type: String, required: true},
}, {timestamps: true})

const Blog = mongoose.models.blogs || mongoose.model("blogs", blogsSchema)

module.exports = Blog