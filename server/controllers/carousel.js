const CarouselItem = require('../models/carouselItem');
const path = require("path")
const fs = require("fs");

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

    const basePath = req.protocol + "://" + req.get("host") + "/uploads/carousels/logos/";
    const image = basePath + req.file.filename;
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
            return res.json({ message: "Carousel item not found" });
        }

        if (deletedItem.logo) {
            const filename = deletedItem.logo.split("/uploads/carousels/logos/")[1];
            const filepath = path.join(__dirname, "../public/uploads/carousels/logos/", filename);
            try {
            if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
            } catch (err) {
            console.error("Error deleting logo image:", err.message);
            }
        }

        res.json({success: true, msg: "deleted successfully"});
    } catch (error) {
        res.json({ msg: "Error deleting carousel item" });
    }
}


module.exports = {
    getCarousel,
    createCarouselItem,
    updateCarouselItem,
    deleteCarouselItem
};
