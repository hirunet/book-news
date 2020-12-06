import sys
import os
import sqlite3
import json


DATABASE_NAME = '../database.sqlite3'


def insert_book(book):
    ccode = ""
    genre = ""
    keywords = ""

    if 'Subject' in book['onix']['DescriptiveDetail']:
        subjects = book['onix']['DescriptiveDetail']['Subject']
        for subject in subjects:
            identifier = subject['SubjectSchemeIdentifier']
            if identifier == "78":
                ccode = subject['SubjectCode']
            if identifier == "79":
                genre = subject['SubjectCode']
            if identifier == "20":
                keywords = subject['SubjectHeadingText']

    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO books (isbn, title, ccode, genre, keywords, data_json) VALUES (?, ?, ?, ?, ?, ?);',
        (book['summary']['isbn'],
         book['summary']['title'],
         ccode,
         genre,
         keywords,
         json.dumps(book),))
    conn.commit()
    conn.close()


def get_isbn_list():
    isbn_list = set()

    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()
    cursor.execute('SELECT isbn FROM books;')

    for result in cursor:
        isbn_list.add(result[0])

    conn.close()

    return isbn_list


if __name__ == '__main__':
    isbn = sys.argv[1]
    url = sys.argv[2]
