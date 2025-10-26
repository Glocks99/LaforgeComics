const Blog = require("../models/blogs")
const { cloudinary } = require("../config/cloudinary");

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

  
  if (!req.file) {
    return res.json({ success: false, msg: "No image uploaded!" });
  }

  const imageUrl = req.file.path;
  
  const makeTagArray = tags.split(",")

  try {
    const newBlog = await Blog.create({
      title,
      image: imageUrl,
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

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ success: false, msg: "Blog not found" });
    }

    // --- DELETE FROM CLOUDINARY ---
    if (blog.image) {
      try {
        // Example URL: https://res.cloudinary.com/demo/image/upload/v1733265421/blogs/myimage.png
        const parts = blog.image.split("/");
        const folderAndFile = parts.slice(-2).join("/"); // e.g., blogs/myimage.png
        const publicId = folderAndFile.split(".")[0]; // remove extension
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Error deleting blog image from Cloudinary:", err.message);
      }
    }

    return res.json({ success: true, msg: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete Blog Error:", error);
    return res.status(500).json({
      success: false,
      msg: "Server error while deleting blog",
      error: error.message,
    });
  }
};


const updateBlog = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, msg: "No blog ID provided." });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, msg: "Blog not found." });
    }

    // Handle tags if sent as a string
    const tags =
      typeof req.body.tags === "string"
        ? req.body.tags.split(",").map((t) => t.trim())
        : req.body.tags;

    const updateData = { ...req.body, tags };

    // --- If a new image is uploaded, delete old one from Cloudinary ---
    if (req.file) {
      // Delete the old image
      if (blog.image) {
        try {
          const parts = blog.image.split("/");
          const folderAndFile = parts.slice(-2).join("/");
          const publicId = folderAndFile.split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Error deleting old blog image from Cloudinary:", err.message);
        }
      }

      // Set the new Cloudinary image URL
      updateData.image = req.file.path;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      msg: "Blog updated successfully.",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Update Blog Error:", error);
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