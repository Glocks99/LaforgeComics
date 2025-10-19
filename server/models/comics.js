const mongoose = require("mongoose");

/**
 * Comic Schema
 * Represents a comic with metadata, relations, and publishing details.
 */
const comicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Comic name is required"],
      trim: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: false, // Make true if always linked to an artist
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "genres"
    },

    coverImage: {
      type: String,
      trim: true,
      default: "",
    },

    avgRating: {
      type: Number,
      default: 0
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Episode" }],
  },
  
  {
    timestamps: true,
    versionKey: false, // Removes __v field
  }
);

// Index searchable fields as text
comicSchema.index({
  name: "text",
  description: "text",
  tags: "text",
});

// Separate index for genre (for filtering)
comicSchema.index({ genre: 1 });

const Comic =
  mongoose.models.Comic || mongoose.model("Comic", comicSchema);

module.exports = Comic;
