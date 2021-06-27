const express = require("express");
const router = express.Router();
const booksModel = require("../models/books");
const auth0 = require("../auth0");

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

router.get("/api/private", auth0.checkJwt, function (req, res) {
  res.json({
    message: "これは秘密のメッセージです",
  });
});

router.get(
  "/api/private-scoped",
  auth0.checkJwt,
  auth0.checkScopes,
  function (req, res) {
    res.json({
      message:
        "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.",
    });
  }
);

module.exports = router;
