const Like = require("../models/likes");
const Comic = require("../models/comics");

// ✅ Toggle like/unlike for a comic
const toggleLike = async (req, res) => {
  try {
    const { userId, comicId } = req.body;

    if (!userId || !comicId) {
      return res.status(400).json({ success: false, message: "User ID and Comic ID are required" });
    }

    const existingLike = await Like.findOne({ user: userId, comic: comicId });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      const totalLikes = await Like.countDocuments({ comic: comicId });
      return res.status(200).json({
        success: true,
        liked: false,
        totalLikes,
        message: "Comic unliked successfully",
      });
    }

    await Like.create({ user: userId, comic: comicId });

    const totalLikes = await Like.countDocuments({ comic: comicId });
    
    res.status(201).json({
      success: true,
      liked: true,
      totalLikes,
      message: "Comic liked successfully",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error toggling like", error: error.message });
  }
};

// ✅ Get all likes for a specific comic
const getLikesForComic = async (req, res) => {
  try {
    const { comicId } = req.params;
    const likes = await Like.find({ comic: comicId }).populate("user", "username");
    res.status(200).json({ success: true, totalLikes: likes.length, likes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching likes", error: error.message });
  }
};

// ✅ Check if a user liked a specific comic (for persistence)
const checkUserLike = async (req, res) => {
  try {
    const { userId, comicId } = req.params;
    const like = await Like.findOne({ user: userId, comic: comicId });
    res.status(200).json({ success: true, liked: !!like });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error checking like", error: error.message });
  }
};

// ✅ Get all likes for a user (for likedComics persistence)
const getLikesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const likes = await Like.find({ user: userId }).populate("comic", "name");
    res.status(200).json({
      success: true,
      likes: likes.map((like) => ({ comic: like.comic._id, name: like.comic.name })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user likes", error: error.message });
  }
};

// ✅ Delete like explicitly (used by your DELETE request)
const deleteLike = async (req, res) => {
  try {
    const { comicId } = req.params;
    const { userId } = req.body;

    const deletedLike = await Like.findOneAndDelete({ user: userId, comic: comicId });

    if (!deletedLike) {
      return res.status(404).json({ success: false, message: "Like not found" });
    }

    res.status(200).json({ success: true, message: "Like removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting like", error: error.message });
  }
};

// ✅ Admin/debug route
const getAllLikesForAdmin = async (req, res) => {
  try {
    const likes = await Like.find().populate("user", "username").populate("comic", "name");
    res.status(200).json({ success: true, likes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching all likes", error: error.message });
  }
};

const getAllLikes = async (req, res) => {
  try {
    const likes = await Like.aggregate([
      { $group: { _id: "$comic", totalLikes: { $sum: 1 } } },
      { $project: { comic: "$_id", totalLikes: 1, _id: 0 } },
    ]);

    res.status(200).json({ success: true, likes });
  } catch (error) {
    console.error("Error fetching all likes:", error);
    res.status(500).json({ success: false, message: "Error fetching likes" });
  }
};

module.exports = {
  toggleLike,
  getLikesForComic,
  checkUserLike,
  getLikesByUser,
  deleteLike,
  getAllLikes,
  getAllLikesForAdmin
};
