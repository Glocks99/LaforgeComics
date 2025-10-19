const router = require("express").Router()
const { getCarousel, updateCarouselItem, deleteCarouselItem, createCarouselItem } = require("../controllers/carousel");
const multer = require("multer");
const path = require("path");

const MIMETYPE = {
  "image/png": ".png",
  "image/jpg": ".jpg",
  "image/jpeg": ".jpeg",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = MIMETYPE[file.mimetype];
    let uploadError = new Error("Invalid image type");
    if (isValid) {
      uploadError = null;
    }
    // Correct path resolution:
    cb(uploadError, path.join(__dirname, "../public/uploads/carousels/logos"));
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = MIMETYPE[file.mimetype];
    cb(null, fileName + "-" + Date.now() + extension);
  },
});

const upload = multer({ storage: storage });



router.get("/", getCarousel)
router.post("/create", upload.single("logo"), createCarouselItem)
router.put("/update/:id", updateCarouselItem)
router.delete("/delete/:id", deleteCarouselItem)

module.exports = router
