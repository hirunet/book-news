const { Client } = require('pg');
const express = require('express');
const router = express.Router();
const moment = require("moment");

const database = process.env.DATABASE_URL;

async function searchBooks(req, res, next) {
  const client = new Client({
    connectionString: database
  });

  let query = 'SELECT * FROM books';
  let params = [];

  // Filter by pubdate
  query += ' WHERE $1 < pubdate AND pubdate <= $2';
  const twoWeeksAgo = moment().add(-14, 'day').format("YYYYMMDD");
  const today = moment().format("YYYYMMDD");
  params.push(twoWeeksAgo);
  params.push(today);

  // Filter by title
  if (req.query.title) {
    query += ' AND title LIKE $3';
    params.push('%' + req.query.title + '%');
  }
  // Filter by ccode
  else if (req.query.ccode) {
    query += ' AND ccode LIKE $3';
    params.push('%' + req.query.ccode + '%');
  }

  query += ' ORDER BY pubdate DESC;';

  await client.connect();
  const result = await client.query(query, params);
  if (req.query.style) {
    style = req.query.style;
  } else {
    style = "list";
  }
  res.render("index", { books: result.rows, style: style });
  await client.end();
}

/* GET home page. */
router.get('/', searchBooks);

module.exports = router;
