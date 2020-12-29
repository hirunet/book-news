const express = require('express');
const router = express.Router();
const booksModel = require('../models/books');


async function getBook(req, res, next) {
  const isbn = parseInt(req.params.isbn, 10);
  const book = await booksModel.getBookByIsbn(isbn);

  res.render("book", { book: book });
}

router.get('/book/:isbn', getBook);

module.exports = router;
