const Blog = require("../models/blogs")
const fs = require("fs")
const path = require("path")

const getAllBlogs = async(req,res) => {
    try {
        const blogs = await Blog.find({}, "-blogs")

        if(!blogs){
            return res.json("No blogs available!")
        }

        return res.json({success: true, blog: blogs})
    } catch (error) {
        return res.json({success: false, msg: error.message})
    }
}

const getBlogById = async(req,res) => {
    const {id} = req.params;

    if(!id){
        return res.json({success: false, msg: "Id is not found!"})
    }

    try {
        const blog = await Blog.findById(id)

        if(!blog){
            return res.json({success: false, msg: "cant find blog!"})
        }

        return res.json({success: true, blog})
    } catch (error) {
        return res.json({success: false, msg: error.message})
    }
}

const createBlog = async (req, res) => {
  const { title, excerpt, author, tags, body } = req.body;

  const basePath = req.protocol + "://" + req.get("host") + "/uploads/blogs/";

  if (!req.file) {
    return res.json({ success: false, msg: "No image uploaded!" });
  }

  const makeTagArray = tags.split(",")

  try {
    const newBlog = await Blog.create({
      title,
      image: basePath + req.file.filename,
      excerpt,
      author,
      tags: makeTagArray,
      body
    });

    if (!newBlog) {
      return res.json({ success: false, msg: "Can't create blog!" });
    }

    return res.json({ success: true, msg: "Blog created successfully!" });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};

const deleteBlog = async(req,res) => {
  const {id} = req.params

  try {
    const blog = await Blog.findByIdAndDelete(id)

    if(!blog){
      return res.json({success: false, msg: "cant delete blog"})
    }

     // Extract filename from full URL
    const filename = blog.image.split("/uploads/blogs/")[1];
    const filepath = path.join(__dirname, "../public/uploads/blogs", filename);

    // Delete the image file
    fs.unlink(filepath, (err) => {
      if (err) {
        console.error("Error deleting image file:", err.message);
        // Continue even if image deletion fails
      }
    });

    return res.json({success: true, msg: "blog deleted"})
  } catch (error) {
    
  }
}


const updateBlog = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, msg: "No blog ID provided." });
  }

  const makeTagArray = req.body.tags.split(",")

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: {...req.body, tags: makeTagArray } },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ success: false, msg: "Blog not found." });
    }

    return res.status(200).json({
      success: true,
      msg: "Blog updated successfully.",
      blog: updatedBlog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error updating blog.",
      error: error.message,
    });
  }
};

const getBlogCount = async(req,res) => {
  try {
    const counts = await Blog.find().countDocuments()

    if(!counts){
      return res.json({success: false})
    }

    return res.json({success: true, msg: counts})
  } catch (error) {
    return res.json({success: false, msg: error.message})
  }
}


module.exports = {getAllBlogs, getBlogById, createBlog, deleteBlog, updateBlog, getBlogCount}