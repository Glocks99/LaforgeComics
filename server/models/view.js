const mongoose = require("mongoose");

const viewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ip: String,
    comic: { type: mongoose.Schema.Types.ObjectId, ref: "Comic", required: true },
    lastViewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Unique compound index (either by user or IP + comic)
viewSchema.index({ user: 1, comic: 1 }, { unique: true, sparse: true });
viewSchema.index({ ip: 1, comic: 1 }, { unique: true, sparse: true });

const View = mongoose.models.View || mongoose.model("View", viewSchema);

module.exports = View