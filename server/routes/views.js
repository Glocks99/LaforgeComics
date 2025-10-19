const router = require("express").Router()
const {viewCount} = require("../controllers/view")

router.get("/",  viewCount)

module.exports =  router