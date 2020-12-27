import os
import psycopg2
import json


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

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO books (isbn, title, volume, series, publisher, pubdate, cover, author, ccode, genre, keywords, data_json) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);',
        (book['summary']['isbn'],
         book['summary']['title'],
         book['summary']['volume'],
         book['summary']['series'],
         book['summary']['publisher'],
         book['summary']['pubdate'],
         book['summary']['cover'],
         book['summary']['author'],
         ccode,
         genre,
         keywords,
         json.dumps(book),))
    conn.commit()
    conn.close()


def get_isbn_list():
    isbn_list = []

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cursor = conn.cursor()
    cursor.execute('SELECT isbn FROM books;')

    for result in cursor:
        isbn_list.append(str(result[0]))

    conn.close()

    return isbn_list
