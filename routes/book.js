const { Client } = require('pg');
const express = require('express');
const router = express.Router();

const database = process.env.DATABASE_URL;

async function getBook(req, res, next) {
  const client = new Client({
    connectionString: database
  });

  const isbn = req.params.isbn;
  const query = 'SELECT * FROM books WHERE isbn = $1';

  await client.connect();

  const result = await client.query(query, [isbn,]);
  res.render("book", { book: result.rows[0] });

  await client.end();
}

/* GET home page. */
router.get('/book/:isbn', getBook);

module.exports = router;
