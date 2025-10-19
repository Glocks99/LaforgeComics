const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    comic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comic",
      required: true,
    },
  },
  { timestamps: true }
);

// prevent duplicate likes by the same user on the same comic
likeSchema.index({ user: 1, comic: 1 }, { unique: true });

const Like = mongoose.models.likes || mongoose.model("likes", likeSchema);

module.exports = Like;
