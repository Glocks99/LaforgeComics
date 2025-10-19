const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema(
  {
    comic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comic",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    episodeNumber: {
      type: Number,
      required: true,
    },

    // 🔥 All image URLs for the episode
    images: [
      {
        type: String, // Cloudinary or S3 URL
        required: true,
      },
    ],

    releaseDate: {
      type: Date,
      default: Date.now,
    },

    // 👁️ Track how many times this episode is viewed
    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 🔒 For locking premium or early-access episodes
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent duplicate episode numbers within the same comic
episodeSchema.index({ comic: 1, episodeNumber: 1 }, { unique: true });

const Episode = mongoose.models.Episode || mongoose.model("Episode", episodeSchema);

module.exports = Episode
