const mongoose = require("mongoose");

const viewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    ip: { type: String, default: null },
    comic: { type: mongoose.Schema.Types.ObjectId, ref: "Comic", required: true },
    lastViewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ Unique by (user + comic) only if user exists
viewSchema.index(
  { user: 1, comic: 1 },
  { unique: true, partialFilterExpression: { user: { $exists: true, $ne: null } } }
);

// ✅ Unique by (ip + comic) only if ip exists
viewSchema.index(
  { ip: 1, comic: 1 },
  { unique: true, partialFilterExpression: { ip: { $exists: true, $ne: null } } }
);

const View = mongoose.models.View || mongoose.model("View", viewSchema);

module.exports = View;
