const Comment = require("../models/comment");

// ✅ Create a new comment
const createComment = async (req, res) => {
  try {
    const { userId, comicId, text } = req.body;

    if (!userId || !comicId || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "User ID, Comic ID, and text are required.",
      });
    }

    const newComment = await Comment.create({
      user: userId,
      comic: comicId,
      text: text.trim(),
    });

    const populatedComment = await newComment.populate("user", "username");

    res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: "Error adding comment.",
      error: error.message,
    });
  }
};

// ✅ Update a comment (with ownership check)
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, userId } = req.body;

    if (!id || !text || !userId) {
      return res.status(400).json({
        success: false,
        message: "Comment ID, user ID, and text are required.",
      });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    // ✅ Ownership check
    if (comment.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this comment.",
      });
    }

    comment.text = text.trim();
    await comment.save();

    const updatedComment = await comment.populate("user", "username");

    res.status(200).json({
      success: true,
      message: "Comment updated successfully.",
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({
      success: false,
      message: "Error updating comment.",
      error: error.message,
    });
  }
};

// ✅ Delete a comment (with ownership check)
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!id || !userId) {
      return res.status(400).json({
        success: false,
        message: "Comment ID and user ID are required.",
      });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    // ✅ Ownership check
    if (comment.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment.",
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting comment.",
      error: error.message,
    });
  }
};

// ✅ (Optional) Get all comments (Admin/debug)
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user", "username")
      .populate("comic", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: comments.length,
      comments,
    });
  } catch (error) {
    console.error("Error fetching all comments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching comments.",
      error: error.message,
    });
  }
};

// ✅ Get all comments for a specific comic
const getCommentsByComic = async (req, res) => {
  try {
    const { comicId } = req.params;

    if (!comicId) {
      return res.status(400).json({ success: false, message: "Comic ID is required." });
    }

    // Fetch all comments for the comic and populate user info
    const comments = await Comment.find({ comic: comicId })
      .populate("user") // Adjust fields as needed
      .sort({ createdAt: -1 }); // newest first

    if (!comments.length) {
      return res.status(200).json({
        success: true,
        message: "No comments found for this comic.",
        comments: [],
      });
    }

    res.status(200).json({
      success: true,
      totalComments: comments.length,
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching comments.",
      error: error.message,
    });
  }
};

// ✅ Get total comments for a specific comic
const getTotalComments = async (req, res) => {
  try {
    const { comicId } = req.params;

    if (!comicId) {
      return res.status(400).json({ success: false, message: "Comic ID is required" });
    }

    // Count total comments for this comic
    const totalComments = await Comment.countDocuments({ comic: comicId });

    res.status(200).json({
      success: true,
      comicId,
      totalComments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching total comments",
      error: error.message,
    });
  }
};



module.exports = {
  createComment,
  getCommentsByComic,
  updateComment,
  deleteComment,
  getAllComments,
  getTotalComments
};
