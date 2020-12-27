const { Client } = require('pg');
const express = require('express');
const router = express.Router();

const database = process.env.DATABASE_URL;

async function getAuthorBookList(req, res, next) {
  const client = new Client({
    connectionString: database
  });

  const name = req.params.name;
  const query = 'SELECT * FROM books WHERE author = $1 ORDER BY pubdate DESC';

  await client.connect();

  const result = await client.query(query, [name,]);
  res.render("index", { books: result.rows, style: 'style' });

  await client.end();
}


/* GET home page. */
router.get('/author/:name', getAuthorBookList);

module.exports = router;
