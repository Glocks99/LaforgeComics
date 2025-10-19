const router = require("express").Router()
const { getAllGenres } = require("../controllers/genres")

router.get("/", getAllGenres)

module.exports = router