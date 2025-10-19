const express = require("express");
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  addRating,
  addComment,
} = require("../controllers/books.js");

const router = express.Router();

router.get("/", getBooks);
router.post("/create", createBook);
router.get("/book/:id", getBookById);
router.put("/update/:id", updateBook);
router.delete("/delete/:id", deleteBook);

// extra endpoints
router.post("/rate/:id", addRating);
router.post("/book/:id/comment", addComment);

module.exports = router;
