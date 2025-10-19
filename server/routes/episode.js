const express = require("express");
const router = express.Router();
const {
  createEpisode,
  getEpisodes,
  getEpisodeById,
  updateEpisode,
  deleteEpisode,
  toggleLock,
} = require("../controllers/episode");

const multer = require("multer");
const path = require("path");

// Allowed image types
const MIMETYPE = {
  "image/png": ".png",
  "image/jpg": ".jpg",
  "image/jpeg": ".jpeg",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
};

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = MIMETYPE[file.mimetype];
    let uploadError = new Error("Invalid image type");

    if (isValid) uploadError = null;

    cb(uploadError, path.join(__dirname, "../public/uploads/episodes"));
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = MIMETYPE[file.mimetype];
    cb(null, `${fileName}-${Date.now()}${extension}`);
  },
});

const upload = multer({ storage });

// Middleware that accepts both “images” and “images[]”
const multiFieldUpload = upload.fields([
  { name: "images", maxCount: 20 }
]);

// ---------------- ROUTES ----------------

// GET all episodes / CREATE new episode
router
  .route("/")
  .get(getEpisodes)
  .post(multiFieldUpload, createEpisode); // supports both field names

// GET / UPDATE / DELETE a specific episode
router
  .route("/:id")
  .get(getEpisodeById)
  .put(multiFieldUpload, updateEpisode)
  .delete(deleteEpisode);

// TOGGLE lock/unlock
router.patch("/:id/lock", toggleLock);

module.exports = router;
