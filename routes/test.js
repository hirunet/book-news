var express = require('express');
var router = express.Router();
const booksModel = require("../models/books");

async function searchBooks(req, res, next) {
  const books = await booksModel.getBooks(req.query);
  
  const books2 = books.map(function(book) {
    const data = book.data_json;
    if (! data.onix) 
      return book;
    if (! data.onix.CollateralDetail) 
      return book;
    if (! data.onix.CollateralDetail.TextContent) 
      return book;

    for (var textContent of data.onix.CollateralDetail.TextContent) {
      if (textContent.TextType == "03" ) {
        // textContent = textContent.Text.replace( /\r?\n/g, '<br />' );
        const MAX_LENGTH = 140;
        let text = textContent.Text;
        if (text.length > MAX_LENGTH) {
          text = text.substr(0, MAX_LENGTH) + "……";
        }
        book.text = text;
        break;
      }
    }
    return book;
  });

  res.render("test", { books: books2 });
}

router.get('/', searchBooks);
module.exports = router;
