const Comic = require("../models/comics")
const Work = require("../models/works")
const View = require("../models/view")
const CarouselItem = require("../models/carouselItem")
const Comments = require("../models/comment")
const Ratings = require("../models/ratings")
const Likes = require("../models/likes")
const Episode = require("../models/episode")
const mongoose = require("mongoose");
const { cloudinary } = require("../config/cloudinary");

const getAllComics = async (req, res) => {
  try {
    const { page = 1, limit, search, genre, author } = req.query;

    // Parse limit safely — default to all if not provided
    const perPage = limit ? parseInt(limit, 10) : null; // null means no limit
    const skip = perPage ? (parseInt(page, 10) - 1) * perPage : 0;

    // Build filter conditions
    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (genre) filter.genre = genre;
    if (author) filter.author = author;
    filter.isPublished = true;

    // Build query
    let query = Comic.find(filter).populate("author genre", "-_id name").sort({ createdAt: -1 });

    if (perPage) query = query.skip(skip).limit(perPage);

    // Execute query
    const comics = await query;

    // Get total count
    const total = await Comic.countDocuments(filter);
    const totalPages = perPage ? Math.ceil(total / perPage) : 1;

    if (!comics || comics.length === 0) {
      return res.json({ success: false, msg: "No comics found" });
    }

    return res.json({
      success: true,
      msg: comics,
      total,
      currentPage: parseInt(page, 10),
      totalPages,
      hasMore: perPage ? parseInt(page, 10) < totalPages : false,
    });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};


const incrementViews = async (req, comicId) => {
  try {
    const userId = req.user?._id || null;
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress;

    const query = userId ? { user: userId, comic: comicId } : { ip, comic: comicId };

    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    const existingView = await View.findOne(query);

    if (existingView) {
      const timeSinceLastView = now - existingView.lastViewedAt;

      // Update timestamp if > 24h
      if (timeSinceLastView >= oneDay) {
        existingView.lastViewedAt = now;
        await existingView.save();

        await Comic.findByIdAndUpdate(comicId, { $inc: { views: 1 } });
      }
    } else {
      // Create new view entry and increment count
      await View.create({ ...query, lastViewedAt: now });
      await Comic.findByIdAndUpdate(comicId, { $inc: { views: 1 } });
    }

    // ✅ Always return the comic data (even if not incremented)
    const comic = await Comic.findById(comicId).populate("author genre", "-_id name").populate("episodes");
    return comic;
  } catch (err) {
    console.error("Error incrementing views:", err.message);
    return null;
  }
};

// ✅ Controller
const getComicById = async (req, res) => {
  try {
    const comicId = req.params.id;
    const comic = await incrementViews(req, comicId);

    if (!comic)
      return res.json({ success: false, msg: "Comic not found" });

    res.json({ success: true, msg: comic });
  } catch (err) {
    res.json({ success: false, msg: err.message });
  }
};

const getComicCount = async(req,res) => {
  try {
    const comics = await Comic.find().countDocuments()
    
    if(!comics){
      return res.json({success: false, msg: "cannot get comic count"})
    }

    return res.json({success: true, comics})
  } catch (error) {
    return res.json({success: false, msg: error.message})
  }
}

const deleteComic = async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    if (!comic) {
      return res.status(404).json({ success: false, msg: "Comic not found" });
    }

    // --- CLEAN UP RELATED DOCUMENTS ---
    await Promise.all([
      Work.deleteMany({ comic: comic._id }),
      Episode.deleteMany({ comic: comic._id }),
      CarouselItem.deleteMany({ comic: comic._id }),
      Comments.deleteMany({ comic: comic._id }),
      Likes.deleteMany({ comic: comic._id }),
      Ratings.deleteMany({ item: comic._id }),
    ]);

    // --- CLEAN UP CLOUDINARY FILES ---
    // 1️⃣ Delete cover image from Cloudinary
    if (comic.coverImage) {
      try {
        // Extract public_id from URL (example: https://res.cloudinary.com/demo/image/upload/v123456789/comics/my-image.jpg)
        const parts = comic.coverImage.split("/");
        const folderAndFile = parts.slice(-2).join("/"); // e.g., comics/my-image.jpg
        const publicId = folderAndFile.split(".")[0]; // remove extension
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Error deleting cover image from Cloudinary:", err.message);
      }
    }

    // 2️⃣ Delete episode images (if any)
    const episodes = await Episode.find({ comic: comic._id });
    for (const ep of episodes) {
      if (ep.images && Array.isArray(ep.images)) {
        for (const img of ep.images) {
          try {
            const parts = img.split("/");
            const folderAndFile = parts.slice(-2).join("/");
            const publicId = folderAndFile.split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error("Error deleting episode image from Cloudinary:", err.message);
          }
        }
      }
    }

    // --- DELETE THE COMIC ITSELF ---
    await comic.deleteOne();

    res.json({
      success: true,
      msg: "Comic and all related data deleted successfully (Cloudinary cleanup done)",
    });
  } catch (err) {
    console.error("Delete Comic Error:", err);
    res.status(500).json({
      success: false,
      msg: "Server Error",
      error: err.message,
    });
  }
};

const addComment = async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    comic.comments.push({ user: req.user._id, text: req.body.text });
    await comic.save();
    res.json({ success: true, msg: "Comment added" });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};

const addRating = async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    const existing = comic.ratings.find((r) => r.user.toString() === req.user._id.toString());
    if (existing) {
      existing.score = req.body.score;
    } else {
      comic.ratings.push({ user: req.user._id, score: req.body.score });
    }
    await comic.save();
    res.json({ success: true, msg: "Rating saved" });
  } catch (err) {
    res.status(400).json({ success: false, msg: err.message });
  }
};


const getPopularComics = async (req, res) => {
  try {
    const comics = await Comic.find().populate("author genre","-_id").sort({ views: -1 }).limit(4);
    res.json({ success: true, msg: comics });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};


const createComic = async (req, res) => {
  try {
    const { name, author, isPublished, description,genre, tags } = req.body;

    if (!name ||!author|| !genre|| !req.file) {
      return res.status(400).json({ success: false, msg: "Missing required fields" });
    }

    const imageUrl = req.file.path;

    const comic = new Comic({
      name,
      author: new mongoose.Types.ObjectId(author),
      isPublished: isPublished || false,
      description,
      coverImage: imageUrl,
      genre: new mongoose.Types.ObjectId(genre),
      tags: Array.isArray(tags) ? tags : tags?.split(",").map((t) => t.trim()),
      views: 0,
    });

    await comic.save();

    const work = await Work({
      artist: new mongoose.Types.ObjectId(author),
      comic: new mongoose.Types.ObjectId(comic._id)
    }).save()

    return res.status(201).json({ success: true, msg: comic  });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

const getLatestComics = async (req, res) => {
  try {
    const comics = await Comic.find().sort({ createdAt: -1 });
    res.json({ success: true, msg: comics });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const getComicNames = async(req,res) => {
   try {
    const comics = await Comic.find({},{name: 1});
    res.json({ success: true, msg: comics });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
}

const getAllComicsForAdmin = async (req, res) => {
  try {
    const { page = 1, limit, search, genre, author } = req.query;

    // Parse limit safely — default to all if not provided
    const perPage = limit ? parseInt(limit, 10) : null; // null means no limit
    const skip = perPage ? (parseInt(page, 10) - 1) * perPage : 0;

    // Build filter conditions
    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (genre) filter.genre = genre;
    if (author) filter.author = author;

    // Build query
    let query = Comic.find(filter).populate("author genre", "-_id name").sort({ createdAt: -1 });

    if (perPage) query = query.skip(skip).limit(perPage);

    // Execute query
    const comics = await query;

    // Get total count
    const total = await Comic.countDocuments(filter);
    const totalPages = perPage ? Math.ceil(total / perPage) : 1;

    if (!comics || comics.length === 0) {
      return res.json({ success: false, msg: "No comics found" });
    }

    return res.json({
      success: true,
      msg: comics,
      total,
      currentPage: parseInt(page, 10),
      totalPages,
      hasMore: perPage ? parseInt(page, 10) < totalPages : false,
    });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};

const updateComic = async (req, res) => {
  try {
    const { comicId, name, description, isPublished } = req.body;

    if (!comicId) {
      return res
        .status(400)
        .json({ success: false, msg: "Comic ID is required." });
    }

    const updatedComic = await Comic.findByIdAndUpdate(
      comicId,
      {
        name,
        description,
        isPublished: !!isPublished, // ensures it's a boolean
      },
      { new: true, runValidators: true } // return the updated comic
    );

    if (!updatedComic) {
      return res
        .status(404)
        .json({ success: false, msg: "Comic not found." });
    }

    return res.status(200).json({
      success: true,
      msg: "Comic updated successfully.",
      comic: updatedComic,
    });
  } catch (error) {
    console.error("Error updating comic:", error);
    return res.status(500).json({
      success: false,
      msg: "An error occurred while updating the comic.",
      error: error.message,
    });
  }
};


module.exports = {getAllComics,getAllComicsForAdmin,updateComic,getComicById,getComicCount,getComicNames,getPopularComics,createComic,incrementViews,addComment,addRating,deleteComic,getLatestComics}