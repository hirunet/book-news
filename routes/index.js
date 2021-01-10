const express = require("express");
const router = express.Router();
const booksModel = require("../models/books");

function sayHello(req, res, next) {
  res.send("Hello, world!");
}

async function getBooks(req, res, next) {
  const books = await booksModel.getBooks(req.query);
  if (!books) {
    res.status(404).send("Not found");
    return;
  }
  res.json(books);
}

async function getBook(req, res, next) {
  const isbn = +req.params.isbn;
  const book = await booksModel.getBookByIsbn(isbn);
  if (!book) {
    res.status(404).send("Not found");
    return;
  }
  res.json(book);
}

router.get("/", sayHello);
router.get("/books", getBooks);
router.get("/books/:isbn", getBook);

module.exports = router;
