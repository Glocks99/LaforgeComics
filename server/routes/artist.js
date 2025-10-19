const router = require("express").Router()
const {getArtists, updateArtist, deleteArtist, createArtist, getRandomArtist, getArtistById} = require("../controllers/artist")
const multer = require("multer")
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
    if (isValid) uploadError = null;

    cb(uploadError, path.join(__dirname, "../public/uploads/artists"));
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = MIMETYPE[file.mimetype];
    cb(null, fileName + "-" + Date.now() + extension);
  },
});

const upload = multer({ storage: storage });


router.get("/", getArtists)
router.get("/random", getRandomArtist)
router.get("/:id", getArtistById)
router.post("/create", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),createArtist)

router.put(
  "/update/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateArtist
);

router.delete("/delete/:id", deleteArtist)

module.exports = router