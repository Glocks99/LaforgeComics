const CarouselItem = require('../models/carouselItem');
const { cloudinary } = require("../config/cloudinary");

const getCarousel = async(req, res) => {
    try {
        const carouselItems = await CarouselItem.find().populate({
            path: 'comic',
            populate: {
                path: 'author genre',
                select: '-_id name'
            }
        });
        res.json(carouselItems);
    } catch (error) {
        res.json({ msg: "Error fetching carousel items" });
    }
}

const createCarouselItem = async (req, res) => {
    const {logo, isDubbed, contentRated, comic} = req.body

    const image = req.file.path;
    try {
        const newItem = new CarouselItem({
            logo: image,
            isDubbed,
            contentRated,
            comic
        });
        await newItem.save();
        res.json({success:true, msg: "added successfully to carousel"});
    } catch (error) {
        res.json({success:false, msg: error.message });
    }
}

const updateCarouselItem = async (req, res) => {
    try {
        const updatedItem = await CarouselItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: "Carousel item not found" });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: "Error updating carousel item" });
    }
}

const deleteCarouselItem = async (req, res) => {
  try {
    const deletedItem = await CarouselItem.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res
        .status(404)
        .json({ success: false, msg: "Carousel item not found" });
    }

    // --- DELETE FROM CLOUDINARY ---
    if (deletedItem.logo) {
      try {
        // Example URL:
        // https://res.cloudinary.com/demo/image/upload/v1733265421/carousels/logos/mylogo.png
        const parts = deletedItem.logo.split("/");
        const folderAndFile = parts.slice(-2).join("/"); // e.g., carousels/logos/mylogo.png
        const publicId = folderAndFile.split(".")[0]; // remove extension

        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Error deleting logo from Cloudinary:", err.message);
      }
    }

    res.json({ success: true, msg: "Carousel item deleted successfully" });
  } catch (error) {
    console.error("Delete Carousel Item Error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error while deleting carousel item",
      error: error.message,
    });
  }
};


module.exports = {
    getCarousel,
    createCarouselItem,
    updateCarouselItem,
    deleteCarouselItem
};
