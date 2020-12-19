const sqlite3 = require('sqlite3').verbose()
const express = require('express');
const router = express.Router();
const moment = require("moment");

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
    const today = moment().format("YYYYMMDD");
    const twoWeeksAgo = moment().add(-14, 'day').format("YYYYMMDD");
    sql = `${sql} WHERE '${twoWeeksAgo}' < pubdate AND pubdate <= '${today}'`;

    // Filter by title
    if (req.query.title) {
      sql = sql + " AND title LIKE '%" + req.query.title + "%'";
    }

    // Filter by ccode
    if (req.query.ccode) {
      sql = sql + " AND ccode  LIKE '" + req.query.ccode + "'";
    }

    sql = sql + " ORDER BY pubdate DESC";
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
