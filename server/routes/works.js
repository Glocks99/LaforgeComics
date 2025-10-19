const router = require("express").Router()

const {getWorks,getWorkById,getRandomWorks,createWork,updateWork,deleteWork} = require("../controllers/works")

router.get("/", getWorks)
router.get("/random", getRandomWorks)
router.get("/:id", getWorkById)
router.post("/create", createWork)
router.put("/update/:id", updateWork)
router.delete("/delete/:id", deleteWork)


module.exports = router