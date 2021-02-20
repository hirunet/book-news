import requests
import db
import datetime

OPENBD_ENDPOINT = 'https://api.openbd.jp/v1/'


def printLog(message):
    now = datetime.datetime.today()
    print('{} {}'.format(
        now.strftime("%Y/%m/%d %H:%M:%S"),
        message))


def chunked(iterable, n):
    """
    リストをn個単位のリストに分割する
    """
    return [iterable[x:x + n] for x in range(0, len(iterable), n)]


def get_coverage():
    """
    openBDから収録ISBNの一覧を取得
    :return: ISBNのリスト
    """
    return requests.get(OPENBD_ENDPOINT + 'coverage').json()


def get_bibs(items):
    """
    openBDからPOSTでデータを取得する
    :param items: ISBNのリスト
    :return: 書誌のリスト
    """
    return requests.post(OPENBD_ENDPOINT + 'get', data={'isbn': ','.join(items)}).json()


if __name__ == '__main__':
#    db.delete_books()
    twoWeeksAgo = datetime.date.today() - datetime.timedelta(weeks=2)
    twoWeeksLater = datetime.date.today() + datetime.timedelta(weeks=2)

    printLog('書誌情報の収集開始')
    coverage = get_coverage()
    printLog('covrege: {}'.format(len(coverage)))
    known_isbn_list = db.get_isbn_list()
    printLog('known_isbn_list: {}'.format(len(known_isbn_list)))
    coverage = list(set(coverage) - set(known_isbn_list))
    printLog('新規に取得する書誌情報の数: {}'.format(len(coverage)))

    # ISBNのリストを10000件単位に分割
    chunked_coverage = chunked(coverage, 10000)

    cnt = 0
    for isbn_list in chunked_coverage:
        printLog('chunk {}/{}'.format(cnt + 1, len(chunked_coverage)))
        printLog('get_bibs start')
        results = get_bibs(isbn_list)
        printLog('get_bibs end')
        printLog('Adding books to database')

        for book in results:
            if not book:
                continue
            if not 'summary' in book:
                continue
            if book['summary']['isbn'] in known_isbn_list:
                continue
            known_isbn_list.append(book['summary']['isbn'])
            if book['summary']['pubdate'] < twoWeeksAgo.strftime("%Y%m%d"):
                continue
            if twoWeeksLater.strftime("%Y%m%d") < book['summary']['pubdate']:
                continue
            if not 'Subject' in book['onix']['DescriptiveDetail']:
                continue
            ccode = ""
            genre = ""
            keywords = ""
            subjects = book['onix']['DescriptiveDetail']['Subject']
            for subject in subjects:
                identifier = subject['SubjectSchemeIdentifier']
                if identifier == "78":
                    ccode = subject['SubjectCode']
                if identifier == "79":
                    genre = subject['SubjectCode']
                if identifier == "20":
                    keywords = subject['SubjectHeadingText']
            if not ccode:
                continue
            
            if ccode[1:] != '979':
                continue
            printLog('{} {} {}'.format(book['summary']['pubdate'], ccode, book['summary']['title']))
            db.insert_book(book)

        cnt = cnt + 1
    printLog('書誌情報の収集完了')
