import requests
from tqdm import tqdm
import db

OPENBD_ENDPOINT = 'https://api.openbd.jp/v1/'


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
    coverage = get_coverage()
    print(len(coverage))
    known_isbn_list = db.get_isbn_list()
    print(len(known_isbn_list))
    coverage = list(set(coverage) - set(known_isbn_list))
    print(len(coverage))

    # ISBNのリストを10000件単位に分割
    chunked_coverage = chunked(coverage, 10000)

    cnt = 0
    for isbn_list in chunked_coverage:
        print('Processing chunk {}/{}'.format(cnt + 1, len(chunked_coverage)))
        results = get_bibs(isbn_list)
        for book in tqdm(results):
            if not 'summary' in book:
                continue
            if int(book['summary']['isbn']) in known_isbn_list:
                continue
            known_isbn_list.append(book['summary']['isbn'])
            db.insert_book(book)

        cnt = cnt + 1
