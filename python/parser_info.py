import re
import json
import os.path
from parser_link import Parser_link, parse_webpage

class Parser_info():
    
    def __init__(self):
        self.link_url_set = set()
        self.film_infos = []
        self.film_url_list = []
        
    def parse_indexav(self, video_code):
        page_indexav = parse_webpage('https://indexav.com/search?keyword=' + video_code)
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
            code = re.search(code_re, code)
            if code is None:
                return
            else:
                return code.group()
            
        elif 'CARIBPR' in code or \
             'PACO' in code or \
             '10MU' in code or \
             '1PONDO' in code:
            code_re = '([0-9]+-[0-9]+)'
            code = re.search(code_re, code)
            if code is None:
                return
            else:
                code = code.group().replace('-', '_')
                return code
        elif 'GACHINCO' in code:
            return re.sub('GACHINCO-', '', code)
        else:
            return code

    def parse_film_info(self, url):
        page_film = parse_webpage(url)
        
        video_code_re = '(?<=watch-)(\w+-){0,2}\w*\d+'
        video_code = re.search(video_code_re, url)
        if video_code is None:
            return None
        video_code = video_code.group().upper()
        search_video_code = self.code_special_case(video_code)

        view_count_re = '<div class=\"film_view_count\".*?>\d*</div>'
        view_count_str = re.search(view_count_re, page_film).group()
        view_count_str = re.sub('<.*?>', '', view_count_str)

        model_re = '<.*>Models:.*?>.*?>'
        model = re.search(model_re, page_film).group()
        model = re.sub('<.*?>', '', model)
        model = re.sub('Models: ', '', model)
        
        title_re = '<title>(.*)</title>'
        title = re.search(title_re, page_film).group()
        title = re.sub('<.*?>', '', title)
        
        if search_video_code is not None:
            parse_indexav_obj = self.parse_indexav(search_video_code)
            if parse_indexav_obj['model'] is not None:
                model = parse_indexav_obj['model']
            if parse_indexav_obj['video_title'] is not None:
                title = parse_indexav_obj['video_title']

        img_url_re = '<img itemprop=\"image\" src=\"(.*?)\" title=\"'
        img_url = re.search(img_url_re, page_film).group(1)

        info = {}
        info['code'] = video_code
        info['search_code'] = search_video_code
        info['url'] = url
        info['count'] = int(view_count_str)
        info['models'] = model
        info['title'] = title
        info['img_url'] = img_url
        return info

    def parse_info_start(self, file_link_path, outfile_info_path = 'film_info_tmp.json'):
        parser_link = Parser_link()
        if not os.path.exists(file_link_path):
            parser_link.parse_link_start(file_link_path)

        self.film_url_list = list(line.strip() for line in open(file_link_path))

        orig_url = parser_link.get_orig_url()
        for idx, url in enumerate(self.film_url_list):
            url = orig_url + url
            url = ''.join(url.split())
            
            print(idx, url)
            info = self.parse_film_info(url)
            
            if info:
                info['id'] = idx + 1
                self.film_infos.append(info)
                with open(outfile_info_path, 'w+') as fp:
                    json.dump(self.film_infos, fp, ensure_ascii=False, indent=2)
        
        print("parse film info finished and write in {} !".format(outfile_info_path))

if __name__ == '__main__':
    file_link_path = '../public/film_link.txt'
    outfile_info_path = '../public/film_info_test.json'
    parser = Parser_info()
    parser.parse_info_start(file_link_path, outfile_info_path)

