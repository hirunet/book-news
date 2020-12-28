const { Client } = require('pg');
const moment = require("moment");

const database = process.env.DATABASE_URL;

// DBから書籍を取得する
async function getBooks(query) {
  const client = new Client({
    connectionString: database
  });

  let statement = 'SELECT * FROM books';
  let params = [];

  // Filter by pubdate
  statement += ' WHERE $1 < pubdate AND pubdate <= $2';
  let fromDate = moment().add(-10, 'day').format("YYYYMMDD");
  if (query.title) {
    fromDate = moment().add(-1000000000, 'day').format("YYYYMMDD");
  }
  const today = moment().format("YYYYMMDD");
  params.push(fromDate);
  params.push(today);

  // Filter by title
  if (query.title) {
    statement += ' AND title LIKE $3';
    params.push('%' + query.title + '%');
  }
  // Filter by ccode
  else if (query.ccode) {
    statement += ' AND ccode LIKE $3';
    params.push('%' + query.ccode + '%');
  }

  statement += ' ORDER BY pubdate DESC, isbn;';

  await client.connect();
  const result = await client.query(statement, params);
  await client.end();

  return result.rows;
}

async function getBook(isbn) {
  const client = new Client({
    connectionString: database
  });

  let statement = 'SELECT * FROM books WHERE isbn = $1;';

  await client.connect();
  const result = await client.query(statement, [isbn, ]);
  await client.end();

  return result.rows[0];
}

async function getBooksByAuthor(author) {
  const client = new Client({
    connectionString: database
  });

  let statement = 'SELECT * FROM books WHERE author = $1 ORDER BY pubdate DESC;';

  await client.connect();
  const result = await client.query(statement, [author, ]);
  await client.end();
  console.log(result);
  return result.rows;
}

exports.getBooks = getBooks;
exports.getBook = getBook;
exports.getBooksByAuthor = getBooksByAuthor;