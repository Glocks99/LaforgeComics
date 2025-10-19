const express = require("express");
const router = express.Router();
const {
  createComment,
  getCommentsByComic,
  updateComment,
  deleteComment,
  getAllComments,
  getTotalComments
} = require("../controllers/comments");

// ✅ POST - Create a new comment
// Body: { userId, comicId, text }
router.post("/", createComment);

// ✅ GET - Get ALL comments (useful for admin dashboard)
router.get("/", getAllComments);

router.get("/:comicId/total", getTotalComments);

// ✅ GET - Get all comments for a specific comic
// Example: /api/comments/comic/67079c8f34e5b2d1d5b1a7a3
router.get("/comic/:comicId", getCommentsByComic);

// ✅ PUT - Update a specific comment
// Example: /api/comments/67079c8f34e5b2d1d5b1a7a3
router.put("/:id", updateComment);

// ✅ DELETE - Delete a specific comment
// Example: /api/comments/67079c8f34e5b2d1d5b1a7a3
router.delete("/:id", deleteComment);

module.exports = router;
