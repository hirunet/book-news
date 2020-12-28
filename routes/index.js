const express = require('express');
const router = express.Router();
const booksModel = require("../models/books");

async function searchBooks(req, res, next) {
  const books = await booksModel.getBooks(req.query);
  if (req.query.style) {
    style = req.query.style;
  } else {
    style = "list";
  }
  res.render("index", { books: books, style: style });
}

router.get('/', searchBooks);

module.exports = router;
