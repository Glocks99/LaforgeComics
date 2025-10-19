const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  comic: { type: mongoose.Schema.Types.ObjectId, ref: "Comic" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  text: { type: String, required: true },
},{timestamps: true});

const Comment = mongoose.models.comments || mongoose.model("comments", commentSchema);
module.exports = Comment;
