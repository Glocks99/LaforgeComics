const mongoose = require("mongoose");

const genreSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: {type: String, required: false}
});

const Genre = mongoose.models.genres || mongoose.model("genres", genreSchema);
module.exports = Genre;
