const Book = require("../models/books");

const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json({ success: true, msg: "Book created successfully", book });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error creating book", error: error.message });
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.find()
    res.status(200).json({ success: true, msg: books });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error fetching books", error: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("uploadedBy", "username email")
      .populate("ratings.user", "username")
      .populate("comments.user", "username");

    if (!book) return res.status(404).json({ success: false, msg: "Book not found" });

    res.status(200).json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error fetching book", error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ success: false, msg: "Book not found" });

    res.status(200).json({ success: true, msg: "Book updated successfully", book });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error updating book", error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ success: false, msg: "Book not found" });

    res.status(200).json({ success: true, msg: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error deleting book", error: error.message });
  }
};

const addRating = async (req, res) => {
  try {
    const { userId, score } = req.body;
    if (score < 1 || score > 5) return res.status(400).json({ success: false, msg: "Score must be 1–5" });

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, msg: "Book not found" });

    // Check if user already rated
    const existingRating = book.ratings.find(r => r.user.toString() === userId);
    if (existingRating) {
      existingRating.score = score;
    } else {
      book.ratings.push({ user: userId, score });
    }

    await book.save();
    res.status(200).json({ success: true, msg: "Rating added/updated", ratings: book.ratings });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error adding rating", error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { userId, text } = req.body;

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, msg: "Book not found" });

    book.comments.push({ user: userId, text });
    await book.save();

    res.status(200).json({ success: true, msg: "Comment added", comments: book.comments });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error adding comment", error: error.message });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  addRating,
  addComment,
};
