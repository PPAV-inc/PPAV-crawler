#!/usr/bin/env python3

import re
import datetime
import json
from parser import parse_webpage, get_code_info

class YouAV(object):

    def __init__(self):
        self.orig_url = 'https://www.youav.com'
        self.film_infos = []

    def get_film_links(self, url):
        print(url)
        page_web = parse_webpage(url)

        film_re = '(?<=href=\")/video/.*?(?=\")'
        film_list = re.findall(film_re, page_web)

        return film_list

    def get_links_generator(self):
        url = self.orig_url

        start_link = self.orig_url + '/videos?'

        page_num = 1
        url = start_link + 'page=' + str(page_num)
        film_url_list = self.get_film_links(url)

        while len(film_url_list) != 0:
            film_url_list = [self.orig_url + url for url in film_url_list]
            yield film_url_list

            page_num += 1
            url = start_link + 'page=' + str(page_num)
            film_url_list = self.get_film_links(url)

        return None


    @classmethod
    def code_special_case(cls, code):
        if 'TOKYO-HOT' in code:
            return re.sub('TOKYO-HOT-', '', code)
        elif 'GACHINCO' in code:
            return re.sub('GACHINCO-', '', code)
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
            if code is not None:
                code = code.group().replace('-', '_')
                return code
        else:
            return code

    def get_film_info(self, url, info_is_exists):
        page_film = parse_webpage(url)

        video_code_re = '(?<=video/\\d{4}/)((\\d+|\\w+)-(\\d+))'
        video_code = re.search(video_code_re, url)
        if video_code is None or page_film is None:
            return None
        video_code = video_code.group().upper()
        search_video_code = self.code_special_case(video_code)

        view_count_re = '\\d+(?=<.*> 點擊)'
        view_count_str = re.search(view_count_re, page_film).group()

        title_re = '(?<=<title>).*?(?=</title>)'
        title = re.search(title_re, page_film).group()

        info = {}
        info['from'] = 'youav'
        info['url'] = url
        info['count'] = int(view_count_str)
        info['update_date'] = datetime.datetime.now()

        if info_is_exists:
            return info
        # filter some films don't have code number
        elif search_video_code is not None:
            info_obj = get_code_info(search_video_code)
            info['code'] = video_code
            info['search_code'] = search_video_code
            info['img_url'] = info_obj['img']
            info['models'] = info_obj['model']
            info['title'] = info_obj['video_title'] if info_obj['video_title'] else title
            return info
        else:
            return None


if __name__ == '__main__':
    YOUAV = YouAV()
    for each in YOUAV.get_links_generator():
        for i in each:
            print(i)
