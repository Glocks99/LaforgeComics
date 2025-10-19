const Rating = require("../models/ratings");
const Comic = require("../models/comics");
const mongoose = require("mongoose");

/**
 * @desc Create or update a rating
 * @route POST /api/ratings/:userId
 * @access Private
 */
const createOrUpdateRating = async (req, res) => {
  try {
    const { score, comicId } = req.body;
    const { userId } = req.params;

    // ✅ Validate input
    if (!score || !comicId || !userId) {
      return res.status(400).json({ success: false, msg: "Missing required fields" });
    }

    // ✅ Check if the user has already rated this comic
    let rating = await Rating.findOne({ user: userId, item: comicId });

    if (rating) {
      // 🟡 Update existing rating
      rating.score = score;
      await rating.save();
    } else {
      // 🟢 Create new rating
      rating = await Rating.create({
        user: new mongoose.Types.ObjectId(userId),
        item: new mongoose.Types.ObjectId(comicId),
        score,
      });
    }

    // ✅ Calculate new average rating for the comic
    const avgResult = await Rating.aggregate([
      { $match: { item: new mongoose.Types.ObjectId(comicId) } },
      { $group: { _id: "$item", avgScore: { $avg: "$score" }, count: { $sum: 1 } } },
    ]);

    // ✅ Update comic’s avgRating field if aggregation worked
    if (avgResult.length > 0) {
      await Comic.findByIdAndUpdate(comicId, { avgRating: avgResult[0].avgScore });
    }

    return res.status(200).json({ success: true, rating });
  } catch (error) {
    console.error("Error creating/updating rating:", error);
    return res.status(500).json({ success: false, msg: error.message });
  }
};

// const getTopRatedComics = async (req, res) => {
//   try {
//     // Aggregate average ratings for each comic
//     const topComics = await Rating.aggregate([
//       {
//         $group: {
//           _id: "$item", // group by comicId
//           avgScore: { $avg: "$score" },
//           count: { $sum: 1 },
//         },
//       },
//       {
//         $sort: { avgScore: -1 }, // sort descending by average score
//       },
//       {
//         $limit: 4, // limit to top 4
//       },
//       {
//         $lookup: {
//           from: "comics", // collection name in MongoDB (lowercase plural)
//           localField: "_id",
//           foreignField: "_id",
//           as: "comic",
//         },
//       },
//       {
//         $unwind: "$comic", // flatten comic array
//       },
//       {
//         $project: {
//           _id: 0,
//           comic: "$comic._id",
//           avgScore: 1,
//         },
//       },
//     ]);

//     res.status(200).json({ success: true, msg: topComics });
//   } catch (error) {
//     console.error("Error fetching top rated comics:", error);
//     res.status(500).json({ success: false, msg: "Failed to fetch top rated comics" });
//   }
// };

const getTopRatedComics = async (req, res) => {
  try {
    // Step 1: Aggregate to find comic IDs with highest avg scores
    const aggregated = await Rating.aggregate([
      {
        $group: {
          _id: "$item", // group by comic ID
          avgScore: { $avg: "$score" },
          totalRatings: { $sum: 1 },
        },
      },
      { $sort: { avgScore: -1 } }, // sort by avg descending
      { $limit: 4 }, // top 4
    ]);

    // Step 2: Extract the comic IDs
    const comicIds = aggregated.map((r) => r._id);

    // Step 3: Fetch and populate those comics
    const comics = await Comic.find({ _id: { $in: comicIds } })
      .select("name coverImage author avgRating description") // select fields you want
      .populate("author", "name") // populate author if needed
      .lean();

    // Step 4: Merge aggregated ratings with comic data
    const result = aggregated.map((r) => {
      const comic = comics.find((c) => c._id.toString() === r._id.toString());
      return {
        comic,
        avgScore: r.avgScore,
        totalRatings: r.totalRatings,
      };
    });

    res.status(200).json({ success: true, msg: result });
  } catch (error) {
    console.error("Error fetching top rated comics:", error);
    res.status(500).json({ success: false, msg: "Failed to fetch top rated comics" });
  }
};

/**
 * @desc Get all ratings
 * @route GET /api/ratings
 */
const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find().populate("user", "username").populate("item", "name");
    res.status(200).json({ success: true, msg: ratings });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

/**
 * @desc Get all ratings for a specific comic
 * @route GET /api/ratings/comic/:comicId
 */
const getRatingsByComic = async (req, res) => {
  try {
    const { comicId } = req.params;
    const ratings = await Rating.find({ item: comicId }).populate("user", "username");
    res.status(200).json({ success: true, msg: ratings });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

/**
 * @desc Get average rating for a comic
 * @route GET /api/ratings/average/:comicId
 */
const getAverageRating = async (req, res) => {
  try {
    const { comicId } = req.params;

    const result = await Rating.aggregate([
      { $match: { item: new mongoose.Types.ObjectId(comicId) } },
      { $group: { _id: "$item", avgRating: { $avg: "$score" } } },
    ]);

    const avgRating = result.length > 0 ? result[0].avgRating : 0;

    res.status(200).json({ success: true, msg: avgRating.toFixed(2) });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

/**
 * @desc Delete a rating
 * @route DELETE /api/ratings/:id
 */
const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Rating.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, msg: "Rating not found" });
    }

    // Optionally remove from Comic ratings array
    await Comic.updateMany({}, { $pull: { ratings: id } });

    res.status(200).json({ success: true, msg: "Rating deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = {
  createOrUpdateRating,
  getAllRatings,
  getRatingsByComic,
  getAverageRating,
  deleteRating,
  getTopRatedComics
};
