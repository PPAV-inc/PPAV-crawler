import urllib.request
import re
import json
from collections import defaultdict
from urllib import parse
import os.path

class PPAV_Parser():
    
    def __init__(self, orig_url):
        self.orig_url = orig_url
        self.film_url_set = set()
        self.link_url_set = set()
        self.film_infos = []
        self.film_url_list = []
        
    def parse_indexav(self, video_code):
        page_indexav = self.parse_webpage('https://indexav.com/search?keyword=' + video_code)
        returnObj = {}
        
        model_re = '<span class=\"video_actor\".*?>(.*)</span>'
        model = re.search(model_re, page_indexav)
        if model is None:
            returnObj['model'] = None
        else:
            returnObj['model'] = re.sub('<.*?>', '', model.group())
        
        video_title_re = '<span class=\"video_title\".*?>(.*)</span>'
        video_title = re.search(video_title_re, page_indexav)
        if video_title is None:
            returnObj['video_title'] = None
        else:
            returnObj['video_title'] = re.sub('<.*?>', '', video_title.group())
        
        return returnObj

    def code_special_case(self, code):
        if 'TOKYO-HOT' in code:
            return re.sub('TOKYO-HOT-', '', code)
        elif 'CARIB' in code and \
             'CARIBPR' not in code:
            code_re = '([0-9]+-[0-9]+)'
            code = re.search(code_re, code).group()
            return code
            
        elif 'CARIBPR' in code or \
             'PACO' in code or \
             '10MU' in code or \
             '1PONDO' in code:
            code_re = '([0-9]+-[0-9]+)'
            code = re.search(code_re, code).group()
            code = code.replace('-', '_')
            return code
        elif 'GACHINCO' in code:
            return re.sub('GACHINCO-', '', code)
        else:
            return code

    def parse_film_link(self, url):

        print(url)
        page_web = self.parse_webpage(url)

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

    def parse_film_info(self, url):
        page_film = self.parse_webpage(url)
        
        video_code_re = '(?<=watch-)(\w+-){0,2}\w*\d+'
        video_code = re.search(video_code_re, url)
        if video_code is None:
            return None
        video_code = video_code.group().upper()
        search_video_code = self.code_special_case(video_code)

        view_count_re = '<div class=\"film_view_count\".*?>\d*</div>'
        view_count = re.search(view_count_re, page_film).group()
        view_count = re.sub('<.*?>', '', view_count)

        model_re = '<.*>Models:.*?>.*?>'
        model = re.search(model_re, page_film).group()
        model = re.sub('<.*?>', '', model)
        model = re.sub('Models: ', '', model)
        
        title_re = '<title>(.*)</title>'
        title = re.search(title_re, page_film).group()
        title = re.sub('<.*?>', '', title)
        
        parse_indexav_obj = self.parse_indexav(search_video_code)
        if parse_indexav_obj['model'] is not None:
            model = parse_indexav_obj['model']
        if parse_indexav_obj['video_title'] is not None:
            title = parse_indexav_obj['video_title']

        info = {}
        info['code'] = video_code
        info['search_code'] = search_video_code
        info['url'] = url
        info['title'] = title
        info['count'] = view_count
        info['models'] = model
        return info

    def parse_webpage(self, url):
        scheme, netloc, path, query, fragment = parse.urlsplit(url)
        path = parse.quote(path)
        url = parse.urlunsplit((scheme, netloc, path, query, fragment))
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla 7.0'})
        page = urllib.request.urlopen(req).read().decode('utf-8')
        return page

    def parse_start(self):
        url = self.orig_url
        file_path = '../public/film_link.txt'
        
        if not os.path.exists(file_path):
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
    
            self.film_url_set = set(self.film_url_list)
            print("change film list to set, size: {} -> {}".format(len(self.film_url_list), len(self.film_url_set)))
    
            with open('../public/film_link.txt', 'w') as fp:
                for each in self.film_url_set:
                    print(each, file=fp)
        else:
            self.film_url_set = set(line.strip() for line in open(file_path))
            
        print("parse film link finished and write in file!")

        for idx, url in enumerate(self.film_url_set):
            url = self.orig_url + url
            url = ''.join(url.split())
            
            print(idx, url)
            info = self.parse_film_info(url)
            if info:
                self.film_infos.append(info)
            if (idx % 20) == 0:
                with open('../public/film_info.json', 'w+') as fp:
                    json.dump(self.film_infos, fp, ensure_ascii=False, indent=2)
        
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

    #film_infos = parser.get_film_infos()

    
