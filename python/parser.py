import urllib.request
import re
import json

class PPAV_Parser():
    def __init__(self, orig_url):
        self.orig_url = orig_url
        self.film_url_set = set()
        self.link_url_set = set([self.orig_url])
        self.film_infos = []

    def parse_film_link(self, url):
        page_web = self.parse_webpage(url)

        page_str = ''
        if url[-1] == '/':
            page_str = '/page.*?'

        film_re = 'href=\"/watch.*.html\"'
        link_re = 'href=\"/\S+'+page_str+'/\"'  # ? is for not greedy

        film_set = set(re.findall(film_re, page_web))
        self.film_url_set |= film_set
        link_set = set(re.findall(link_re, page_web))
        self.link_url_set |= link_set
        print("film_url_set size: {}, link_url_set size: {}".format(len(self.film_url_set), len(self.link_url_set)))    


    def parse_film_info(self, url):
        page_film = self.parse_webpage(url)

        view_count_re = '<div class=\"film_view_count\".*</div>'
        view_count = re.search(view_count_re, page_film).group()
        view_count = re.sub('<.*?>', '', view_count)

        model_re = '<.*>Models:.*>.*<.*>'
        model = re.search(model_re, page_film).group()
        model = re.sub('<.*?>', '', model)

        info = {}
        info['url'] = url
        info['count'] = view_count
        info['models'] = model
        return info
        

    def parse_webpage(self, url):
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla 7.0'})
        page = urllib.request.urlopen(req).read().decode('utf-8')
        return page



    def parse_start(self):
        url = self.orig_url
        done_url_set = set()

        while self.link_url_set:
            if len(self.film_url_set) >= 100:
                break
            
            self.parse_film_link(url)   
            done_url_set.add(url)

            url = self.link_url_set.pop()
            while url in done_url_set:
                url = self.link_url_set.pop()
            print(url)
            url = re.sub('"', '', url)
            url = re.sub('href=', '', url)
            url = self.orig_url + url

        print("parse film link finished!")

        for idx, url in enumerate(self.film_url_set):
            url = re.sub('"', '', url)
            url = re.sub('href=', '', url)
            url = self.orig_url + url
            
            print(idx, url)
            self.film_infos.append(self.parse_film_info(url))
        
        print("parse film info finished!")  

        #import cPickle as pickle
        #with open('film_url_set.pkl', 'wb') as fp:
        #   pickle.dump(film_url_set, fp)

        
    def get_film_infos(self):
        return self.film_infos


if __name__ == '__main__':
    orig_url = "http://xonline.vip"
    parser = PPAV_Parser(orig_url)
    parser.parse_start()

    film_infos = parser.get_film_infos()

    with open('../public/film_info.json', 'w+') as fp:
        json.dump(film_infos, fp)