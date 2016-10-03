import urllib.request
import re
import json

class PPAV_Parser():
    
    def __init__(self, orig_url):
        self.orig_url = orig_url
        self.film_url_set = set()
        self.link_url_set = set([self.orig_url])
        self.film_infos = []
        
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
        page_web = self.parse_webpage(url)

        # subpage of link
        page_str = ''
        if url[-1] == '/':
            page_str = '/page.*?' # ? is for not greedy

        film_re = '(?<=href=\")/watch.*?.html(?=\")'
        link_re = '(?<=href=\")/\S+' + page_str + '/(?=\")'

        film_set = set(re.findall(film_re, page_web))
        self.film_url_set |= film_set
        link_set = set(re.findall(link_re, page_web))
        self.link_url_set |= link_set
        print("film_url_set size: {}, link_url_set size: {}".format(len(self.film_url_set), len(self.link_url_set)))


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
            
            url = self.orig_url + url
            url = ''.join(url.split())

        print("parse film link finished!")

        for idx, url in enumerate(self.film_url_set):
            url = self.orig_url + url
            url = ''.join(url.split())
            
            print(idx, url)
            info = self.parse_film_info(url)
            if info:
                self.film_infos.append(info)
        
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
        json.dump(film_infos, fp, ensure_ascii=False, indent=2)
