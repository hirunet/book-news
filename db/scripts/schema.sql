CREATE TABLE books(
  isbn        INTEGER PRIMARY KEY,
  title       TEXT,
  ccode       TEXT,
  genre       TEXT,
  keywords    TEXT,
  data_json   JSON,
  created_at  TEXT DEFAULT (DATETIME('now', 'localtime')),
  updated_at  TEXT DEFAULT (DATETIME('now', 'localtime'))
);

CREATE TRIGGER trigger_books_updated_at AFTER UPDATE ON books
BEGIN
    UPDATE books SET updated_at = DATETIME('now', 'localtime') WHERE rowid == NEW.rowid;
END;
