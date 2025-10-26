const router = require("express").Router();
const path = require("path");
const { getAllBlogs, getBlogById, createBlog,deleteBlog,updateBlog, getBlogCount } = require("../controllers/blogs");
const { makeUploader } = require("../config/cloudinary");
const upload = makeUploader("blogs");

router.get("/", getAllBlogs);
router.get("/count", getBlogCount)
router.post("/create-blog", upload.single("image"), createBlog);
router.get("/:id", getBlogById);
router.patch("/:id",upload.single("image"),updateBlog)
router.delete("/:id", deleteBlog)

module.exports = router;
