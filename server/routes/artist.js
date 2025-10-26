const router = require("express").Router();
const {
  getArtists,
  updateArtist,
  deleteArtist,
  createArtist,
  getRandomArtist,
  getArtistById,
} = require("../controllers/artist");
const { makeUploader } = require("../config/cloudinary");

// ✅ create Cloudinary uploader that mirrors your old folder
const upload = makeUploader("artists");

// ROUTES
router.get("/", getArtists);
router.get("/random", getRandomArtist);
router.get("/:id", getArtistById);

// ✅ Create artist with image + coverImage
router.post(
  "/create",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  createArtist
);

// ✅ Update artist with image + coverImage
router.put(
  "/update/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateArtist
);

// ✅ Delete artist
router.delete("/delete/:id", deleteArtist);

module.exports = router;
