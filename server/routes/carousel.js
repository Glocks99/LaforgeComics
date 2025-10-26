const router = require("express").Router()
const { getCarousel, updateCarouselItem, deleteCarouselItem, createCarouselItem } = require("../controllers/carousel");
const { makeUploader } = require("../config/cloudinary"); // path to your makeUploader.js

// Create uploader for comics (Cloudinary folder name)
const upload = makeUploader("logos");


router.get("/", getCarousel)
router.post("/create", upload.single("logo"), createCarouselItem)
router.put("/update/:id", updateCarouselItem)
router.delete("/delete/:id", deleteCarouselItem)

module.exports = router
