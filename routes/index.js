const sqlite3 = require('sqlite3').verbose()
const express = require('express');
const router = express.Router();

const dbpath = '../book-crawler/database.sqlite3';


function searchBooks(req, res, next) {
  // TODO タイトル検索機能
  if (req.query.title) {
    console.log('title: ' + req.query.title);
  }


  let db = new sqlite3.Database(dbpath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      return console.error(err.message);
    }
  });

  db.serialize(() => {
    const books = [];

    let sql = "SELECT * FROM books";
    if (req.query.title || req.query.ccode) {
      sql = sql + " WHERE";
      if (req.query.ccode) {
        console.log('ccode: ' + req.query.ccode)
        sql = sql + " ccode  LIKE '" + req.query.ccode + "'";
      }
      if (req.query.title) {
        console.log('title: ' + req.query.title)
        if (req.query.ccode) {
          sql = sql + " AND";
        }
        sql = sql + " title  LIKE '%" + req.query.title + "%'";
      }
    }
    sql = sql + " ORDER BY pubdate desc;";
    console.log(sql);

    db.all(sql, (err, rows) => {
      if (err) {
        console.error(err.messages);
      }
      res.render("index", { books: rows });
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
