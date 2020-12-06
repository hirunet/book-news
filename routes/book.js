const sqlite3 = require('sqlite3').verbose()
const express = require('express');
const router = express.Router();

const dbpath = './db/database.sqlite3';


function getBook(req, res, next) {
  let db = new sqlite3.Database(dbpath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      return console.error(err.message);
    }
  });

  db.serialize(() => {
    const isbn = req.params.isbn;

    const sql = "SELECT * FROM books WHERE isbn = " + isbn + ";";
    console.log(sql);

    db.all(sql, (err, rows) => {
      if (err) {
        console.error(err.messages);
      }
      if (rows) {
        res.render("book", { book: rows[0] });
      } else {
        res.send("error " + isbn);
      }
    });

  });

  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
}

/* GET home page. */
router.get('/book/:isbn', getBook);

module.exports = router;
