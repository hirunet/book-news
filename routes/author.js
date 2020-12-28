const express = require('express');
const router = express.Router();
const booksModel = require("../models/books");

const database = process.env.DATABASE_URL;

async function getAuthorBookList(req, res, next) {
  const name = req.params.name;

  const books = await booksModel.getBooksByAuthor(name);
  res.render("index", { books: books, style: 'style' });
}

router.get('/author/:name', getAuthorBookList);

module.exports = router;
