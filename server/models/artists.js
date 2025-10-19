const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: false, default: "" },
  coverImage: {type: String, required: false, default: ""},
  email: {type: String, required: true},
  bio: { type: String, required: true },
  socialLinks: {
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    website: { type: String, default: "" },
    youtube: { type: String, default: "" },
    contact: { type: String, default: "" }
  },
  phone: {type: String, required: false, default: ""}
}, { timestamps: true });

const Artist = mongoose.model('Artist', artistSchema);
module.exports = Artist;
