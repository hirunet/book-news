const sqlite3 = require('sqlite3').verbose()
const express = require('express');
const router = express.Router();

const dbpath = './db/database.sqlite3';


function searchBooks(req, res, next) {
  let db = new sqlite3.Database(dbpath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      return console.error(err.message);
    }
  });

  db.serialize(() => {
    const books = [];

    let sql = "SELECT * FROM books";

    // Filter by pubdate
    // TODO
    sql = sql + " WHERE '20201201' < pubdate AND pubdate < '20201220'";

    // Filter by title
    if (req.query.title) {
      sql = sql + " AND title LIKE '%" + req.query.title + "%'";
    }

    // Filter by ccode
    if (req.query.ccode) {
      sql = sql + " AND ccode  LIKE '" + req.query.ccode + "'";
    }

    sql = sql + " LIMIT 100;";
    console.log(sql);

    db.all(sql, (err, rows) => {
      if (err) {
        console.error(err.messages);
      }
      if (req.query.style) {
        style = req.query.style;
      } else {
        style = "list";
      }
      res.render("index", { books: rows, style: style });
    });
  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}

/* GET home page. */
router.get('/', searchBooks);

module.exports = router;
