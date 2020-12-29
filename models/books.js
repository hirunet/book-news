const { Client } = require('pg');
const moment = require("moment");

const database = process.env.DATABASE_URL;

/**
 * DBから検索条件にあった書籍のリストを取得する
 * @param {Object} query 検索条件
 *    以下のプロパティを指定できる
 *    - タイトル
 *    - Cコード
 * @return {Array.<Object>} books 取得した書籍のリスト
 */
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

/**
 * DBから指定したISBNの書籍を取得する
 * @param {number} isbn ISBN
 * @return {Object} book 取得した書籍
 */
async function getBookByIsbn(isbn) {
  const client = new Client({
    connectionString: database
  });

  let statement = 'SELECT * FROM books WHERE isbn = $1;';

  await client.connect();
  const result = await client.query(statement, [isbn, ]);
  await client.end();

  return result.rows[0];
}

/**
 * DBから指定した著者名の書籍のリストを取得する
 * @param {String} author 著者名
 * @return {Array.<Object>} books 取得した書籍のリスト
 */
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
exports.getBookByIsbn = getBookByIsbn;
exports.getBooksByAuthor = getBooksByAuthor;
