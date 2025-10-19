const mongoose = require('mongoose');

const carouselItemSchema = new mongoose.Schema({
  logo: {type: String, required: true, default:""},
  contentRated: {type: String, required: true},
  isDubbed: {type: Boolean, required: true},
  comic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comic'
  }
}, { timestamps: true });

const CarouselItem = mongoose.model('CarouselItem', carouselItemSchema);
module.exports = CarouselItem;
