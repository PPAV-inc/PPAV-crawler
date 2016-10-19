import urllib.request
import re
from urllib import parse
import os.path

class Parser_link:
    
    def __init__(self, orig_url = 'http://xonline.vip'):
        self.orig_url = orig_url
        self.link_url_set = set()
        self.film_url_list = []

    def parse_film_link(self, url):
        print(url)
        page_web = parse_webpage(url)

        if url == self.orig_url:
            link_re = '(?<=href=\")(?:'+self.orig_url+')?/\S+?/\S+?/(?:page-\d+/)?(?=\")'
            link_set = set(re.findall(link_re, page_web))
            self.link_url_set |= link_set

        film_re = '(?<=href=\")/watch.*?.html(?=\")'
        film_list = re.findall(film_re, page_web)

        # last page
        if len(film_list) == 0:
            return "Done"

        self.film_url_list += film_list
        print("film_url_list size: {}".format(len(self.film_url_list)))

    def parse_link_start(self):
        url = self.orig_url
        self.parse_film_link(url)
        for link_type in self.link_url_set:
            if self.orig_url not in link_type:
                link_type = self.orig_url + link_type
            subpage_num = 0

            while True:
                subpage_num += 1
                url = link_type + 'page-' + str(subpage_num) + '/'
                if self.parse_film_link(url) == "Done":
                    break
                
        film_url_set = set(self.orig_url + url for url in self.film_url_list)
        print("parse finished, change film list to set, size: {} -> {}".format(len(self.film_url_list), len(film_url_set)))

        return film_url_set

    def get_orig_url(self):
        return self.orig_url

# global function
def parse_webpage(url):
    scheme, netloc, path, query, fragment = parse.urlsplit(url)
    path = parse.quote(path)
    url = parse.urlunsplit((scheme, netloc, path, query, fragment))
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla 7.0'})
    page = urllib.request.urlopen(req).read().decode('utf-8')
    return page

if __name__ == '__main__':
    orig_url = "http://xonline.vip"
    parser = Parser_link(orig_url)
    parser.parse_link_start()

