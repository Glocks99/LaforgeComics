const express = require("express");
const router = express.Router();
const {
  createOrUpdateRating,
  getAllRatings,
  getRatingsByComic,
  getAverageRating,
  deleteRating,
  getTopRatedComics
} = require("../controllers/ratings");

// Create or update a rating (userId is passed as param)
router.post("/:userId", createOrUpdateRating);

// Get all ratings
router.get("/", getAllRatings);

router.get("/topRated", getTopRatedComics)

// Get ratings for a specific comic
router.get("/comic/:comicId", getRatingsByComic);

// Get average rating for a specific comic
router.get("/average/:comicId", getAverageRating);

// Delete a rating
router.delete("/:id", deleteRating);

module.exports = router;
