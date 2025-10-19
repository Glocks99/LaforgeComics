const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Comic' }, // or whatever you're rating
  score: { type: Number, required: true, min: 1, max: 5 }
}, {timestamps: true});


const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;