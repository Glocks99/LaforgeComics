const router = require("express").Router()
const {getAllComics,createComic,updateComic,deleteComic,getAllComicsForAdmin,getComicNames, getComicCount, getPopularComics,addComicPage, getComicById} = require("../controllers/comic")
const { makeUploader } = require("../config/cloudinary");
// Create uploader for comics (Cloudinary folder name)
const upload = makeUploader("comics");


router.get('/', getAllComics)
router.get('/admin', getAllComicsForAdmin)
router.get('/popComics', getPopularComics)
router.get('/names', getComicNames)
router.get('/count', getComicCount)
router.get('/:id', getComicById)
// Upload to Cloudinary
router.post("/add-comic", upload.single("coverImage"), createComic);
router.put("/update", updateComic)
router.delete("/:id", deleteComic)

module.exports = router