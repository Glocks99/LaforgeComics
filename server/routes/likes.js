const express = require("express");
const router = express.Router();
const {
  toggleLike,
  getLikesForComic,
  checkUserLike,
  getLikesByUser,
  deleteLike,
  getAllLikes,
  getAllLikesForAdmin
} = require("../controllers/likes");

// ✅ Toggle like/unlike
router.post("/", toggleLike);

// ✅ Get all likes (admin/debug)
router.get("/", getAllLikesForAdmin);

router.get("/all", getAllLikes);

// ✅ Get likes for a specific comic
router.get("/comic/:comicId", getLikesForComic);

// ✅ Get all likes by a specific user
router.get("/user/:userId", getLikesByUser);

// ✅ Check if a user liked a specific comic
router.get("/check/:userId/:comicId", checkUserLike);

// ✅ Delete a like (used for unlike)
router.delete("/:comicId", deleteLike);

module.exports = router;
