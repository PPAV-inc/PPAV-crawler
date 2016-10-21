import re
import urllib.request
from urllib import parse

class ParserLink:

    def __init__(self, orig_url='http://xonline.vip'):
        self.orig_url = orig_url

    def parse_film_link(self, url, film_url_list=None):
        print(url)
        page_web = parse_webpage(url)

        if url == self.orig_url:
            link_re = '(?<=href=\")(?:'+self.orig_url+')?/\\S+?/\\S+?/(?:page-\\d+/)?(?=\")'
            link_set = set(re.findall(link_re, page_web))
            return link_set

        film_re = '(?<=href=\")/watch.*?.html(?=\")'
        film_list = re.findall(film_re, page_web)

        # last page
        if len(film_list) == 0:
            return False

        film_url_list += film_list
        print("film_url_list size: {}".format(len(film_url_list)))
        return True

    def parse_link_generator(self):
        url = self.orig_url
        link_url_set = self.parse_film_link(url)   # get all link_type
        for link_type in link_url_set:
            if self.orig_url not in link_type:
                link_type = self.orig_url + link_type

            subpage_num = 1
            url = link_type
            film_url_list = []

            while self.parse_film_link(url, film_url_list):
                subpage_num += 1
                url = link_type + 'page-' + str(subpage_num) + '/'

            film_url_list = [self.orig_url + url for url in film_url_list]
            yield film_url_list

        return None

# global function
def parse_webpage(url):
    scheme, netloc, path, query, fragment = parse.urlsplit(url)
    path = parse.quote(path)
    url = parse.urlunsplit((scheme, netloc, path, query, fragment))
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla 7.0'})
    page = urllib.request.urlopen(req).read().decode('utf-8')
    return page

if __name__ == '__main__':
    ORIG_URL = "http://xonline.vip"
    PARSER = ParserLink(ORIG_URL)
    for each in PARSER.parse_link_generator():
        for i in each:
            print(i)
