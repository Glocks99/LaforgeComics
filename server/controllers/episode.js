const Episode = require("../models/episode.js");
const Comic = require("../models/comics.js");
const { cloudinary } = require("../config/cloudinary");
/**
 * @desc    Create a new episode
 * @route   POST /api/episodes
 * @access  Private (Admin / Creator)
 */
const createEpisode = async (req, res) => {
  try {
    const { comicId, title, episodeNumber, isLocked } = req.body;

    // --- Validate required fields ---
    if (!comicId || !title || !episodeNumber) {
      return res.status(400).json({ success: false, msg: "Missing required fields" });
    }

    // --- Check if comic exists ---
    const comic = await Comic.findById(comicId);
    if (!comic) {
      return res.status(404).json({ success: false, msg: "Comic not found" });
    }

    // --- Ensure unique episode number ---
    const existingEpisode = await Episode.findOne({ comic: comicId, episodeNumber });
    if (existingEpisode) {
      return res.status(400).json({
        success: false,
        msg: "Episode number already exists for this comic",
      });
    }

    // --- Handle multiple field formats ---
    let files = [];
    if (Array.isArray(req.files)) {
      files = req.files; // multer.array()
    } else if (req.files?.images) {
      files = req.files.images; // multer.fields({ name: 'images' })
    } else if (req.files?.["images[]"]) {
      files = req.files["images[]"];
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, msg: "At least one image is required" });
    }

    // --- Collect Cloudinary URLs (already uploaded via middleware) ---
    const imagePaths = files.map((file) => file.path); // Cloudinary gives secure URL in file.path

    // --- Create Episode ---
    const episode = await Episode.create({
      comic: comicId,
      title,
      episodeNumber,
      images: imagePaths,
      isLocked: isLocked === "true" || false,
    });

    // --- Add episode reference to comic ---
    await Comic.findByIdAndUpdate(comicId, { $push: { episodes: episode._id } });

    res.json({
      success: true,
      msg: "Episode created successfully",
      episode,
    });
  } catch (error) {
    console.error("Create Episode Error:", error);
    res.json({
      success: false,
      msg: "Server Error",
      error: error.message,
    });
  }
}

/**
 * @desc    Get all episodes (optionally filter by comic)
 * @route   GET /api/episodes?comicId=123
 * @access  Public
 */
const getEpisodes = async (req, res) => {
  try {
    const { comicId } = req.query;

    const filter = comicId ? { comic: comicId } : {};
    const episodes = await Episode.find(filter)
      .populate("comic", "name coverImage")
      .sort({ episodeNumber: 1 });

    res.status(200).json({
      success: true,
      count: episodes.length,
      episodes,
    });
  } catch (error) {
    console.error("Get Episodes Error:", error);
    res.status(500).json({ success: false, msg: "Server Error", error: error.message });
  }
};

/**
 * @desc    Get a single episode by ID
 * @route   GET /api/episodes/:id
 * @access  Public
 */
const getEpisodeById = async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id).populate("comic", "name coverImage");

    if (!episode) {
      return res.status(404).json({ success: false, msg: "Episode not found" });
    }

    // Auto-increment views each time it’s opened
    episode.views += 1;
    await episode.save();

    res.status(200).json({ success: true, episode });
  } catch (error) {
    console.error("Get Episode Error:", error);
    res.status(500).json({ success: false, msg: "Server Error", error: error.message });
  }
};

/**
 * @desc    Update an episode
 * @route   PUT /api/episodes/:id
 * @access  Private (Admin / Creator)
 */
const updateEpisode = async (req, res) => {
  try {
    const { title, episodeNumber, isLocked } = req.body;

    const episode = await Episode.findById(req.params.id);
    if (!episode) {
      return res.status(404).json({ success: false, msg: "Episode not found" });
    }

    // 🧠 Handle uploaded files
    let files = [];
    if (Array.isArray(req.files)) {
      files = req.files;
    } else if (req.files?.images) {
      files = req.files.images;
    } else if (req.files?.["images[]"]) {
      files = req.files["images[]"];
    }

    // Build new image URLs (if any uploaded)
    let newImagePaths = [];
    if (files && files.length > 0) {
      const basePath = `${req.protocol}://${req.get("host")}/uploads/episodes/`;
      newImagePaths = files.map((file) => basePath + file.filename);
    }

    // ✅ Update only what was provided
    if (title) episode.title = title;
    if (episodeNumber) episode.episodeNumber = episodeNumber;
    if (typeof isLocked !== "undefined") {
      episode.isLocked = isLocked === "true" || isLocked === true;
    }

    // If new images uploaded, replace the old ones
    if (newImagePaths.length > 0) {
      episode.images = newImagePaths;
    }

    await episode.save();

    res.status(200).json({
      success: true,
      msg: "Episode updated successfully",
      episode,
    });
  } catch (error) {
    console.error("Update Episode Error:", error);
    res
      .status(500)
      .json({ success: false, msg: "Server Error", error: error.message });
  }
};


/**
 * @desc    Delete an episode
 * @route   DELETE /api/episodes/:id
 * @access  Private (Admin / Creator)
 */
const deleteEpisode = async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) {
      return res.status(404).json({ success: false, msg: "Episode not found" });
    }

    await Episode.findByIdAndDelete(req.params.id);

    // Remove the episode reference from the Comic
    await Comic.findByIdAndUpdate(episode.comic, {
      $pull: { episodes: episode._id },
    });

    res.status(200).json({ success: true, msg: "Episode deleted successfully" });
  } catch (error) {
    console.error("Delete Episode Error:", error);
    res.status(500).json({ success: false, msg: "Server Error", error: error.message });
  }
};

/**
 * @desc    Toggle lock/unlock for premium episodes
 * @route   PATCH /api/episodes/:id/lock
 * @access  Private (Admin / Creator)
 */
const toggleLock = async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) {
      return res.status(404).json({ success: false, msg: "Episode not found" });
    }

    episode.isLocked = !episode.isLocked;
    await episode.save();

    res.status(200).json({
      success: true,
      msg: `Episode ${episode.isLocked ? "locked" : "unlocked"} successfully`,
      episode,
    });
  } catch (error) {
    console.error("Toggle Lock Error:", error);
    res.status(500).json({ success: false, msg: "Server Error", error: error.message });
  }
};


module.exports = {
    createEpisode,
    getEpisodeById,
    getEpisodes,
    updateEpisode,
    deleteEpisode,
    toggleLock
}