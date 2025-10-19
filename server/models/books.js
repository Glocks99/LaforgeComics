const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, default: "" }, // Cover image URL
    author: { type: String, required: true },
    genre: { type: [String], required: true }, // Multiple genres allowed
    published: { type: Date, required: true }, // Exact publication date

    isFavourite: { type: Boolean, default: false },

    pages: [
      {
        number: { type: Number, required: true },
        content: { type: String, required: true }, // Could be text or image URL
      },
    ],

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to User collection
    },

    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        score: { type: Number, min: 1, max: 5 },
      },
    ],

    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        text: { type: String },
        postedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // createdAt, updatedAt
);

const Book = mongoose.models.books || mongoose.model("books", bookSchema);

module.exports = Book;