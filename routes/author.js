const sqlite3 = require('sqlite3').verbose()
const express = require('express');
const router = express.Router();

const dbpath = './db/database.sqlite3';


function getAuthorBookList(req, res, next) {
  let db = new sqlite3.Database(dbpath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      return console.error(err.message);
    }
  });

  db.serialize(() => {
    const author = decodeURIComponent(req.params.name);

    const sql = "SELECT * FROM books WHERE json_extract(data_json, '$.summary.author') = '" + author + "';";
    console.log(sql);

    db.all(sql, (err, rows) => {
      if (err) {
        console.error(err.messages);
      }
      if (rows) {
        res.render("index", { books: rows });
      } else {
        res.send("error");
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
router.get('/author/:name', getAuthorBookList);

module.exports = router;
