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
const { makeUploader } = require("../config/cloudinary");
const upload = makeUploader("episodes");

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
