const mongoose = require("mongoose");

const workSchema = new mongoose.Schema(
  {
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },
    comic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comic"
    }

  },
  { timestamps: true }
);

const Work = mongoose.models.Work || mongoose.model("Work", workSchema);

module.exports = Work;
