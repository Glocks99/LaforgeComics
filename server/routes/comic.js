const router = require("express").Router()
const {getAllComics,createComic,updateComic,deleteComic,getAllComicsForAdmin,getComicNames, getComicCount, getPopularComics,addComicPage, getComicById} = require("../controllers/comic")
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
    if (isValid) {
      uploadError = null;
    }
    // Correct path resolution:
    cb(uploadError, path.join(__dirname, "../public/uploads/comics"));
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = MIMETYPE[file.mimetype];
    cb(null, fileName + "-" + Date.now() + extension);
  },
});

const upload = multer({ storage: storage });


router.get('/', getAllComics)
router.get('/admin', getAllComicsForAdmin)
router.get('/popComics', getPopularComics)
router.get('/names', getComicNames)
router.get('/count', getComicCount)
router.get('/:id', getComicById)
router.post("/add-comic", upload.single("coverImage"), createComic)
router.put("/update", updateComic)
router.delete("/:id", deleteComic)

module.exports = router