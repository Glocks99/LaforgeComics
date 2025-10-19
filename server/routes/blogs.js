const router = require("express").Router();
const path = require("path");
const { getAllBlogs, getBlogById, createBlog,deleteBlog,updateBlog, getBlogCount } = require("../controllers/blogs");
const multer = require("multer");

const MIMETYPE = {
  "image/png": ".png",
  "image/jpg": ".jpg",
  "image/jpeg": ".jpeg",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = MIMETYPE[file.mimetype];
    let uploadError = new Error("Invalid image type");
    if (isValid) {
      uploadError = null;
    }
    // Correct path resolution:
    cb(uploadError, path.join(__dirname, "../public/uploads/blogs"));
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = MIMETYPE[file.mimetype];
    cb(null, fileName + "-" + Date.now() + extension);
  },
});

const upload = multer({ storage: storage });

router.get("/", getAllBlogs);
router.get("/count", getBlogCount)
router.post("/create-blog", upload.single("image"), createBlog);
router.get("/:id", getBlogById);
router.patch("/:id",upload.single("image"),updateBlog)
router.delete("/:id", deleteBlog)

module.exports = router;
