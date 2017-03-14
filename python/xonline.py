#!/usr/bin/env python3

import re
import datetime
import json
from parser import parse_webpage, get_code_info

class Xonline(object):

    def __init__(self):
        self.orig_url = 'http://xonline.vip'
        self.film_infos = []
        self.tags_dict = None

    def get_film_links(self, url):
        print(url)
        page_web = parse_webpage(url)

        film_re = '(?<=href=\")/watch.*?.html(?=\")'
        film_list = re.findall(film_re, page_web)

        return film_list

    def get_film_pages(self, url):
        print(url)
        page_web = parse_webpage(url)

        link_re = '(?<=href=\")(?:' \
                    + self.orig_url \
                    + ')?/\\S+?/\\S+?/(?:page-\\d+/)?(?=\")'
        link_set = set(re.findall(link_re, page_web))
        return link_set


    def get_links_generator(self):
        url = self.orig_url
        # link_set = self.get_film_pages(url)   # get all link_type
        link_set = set()

        ##################################
        # only parse link_type is asia
        link_set.clear()
        link_set.add('/country/asia/')
        ##################################

        for link_type in link_set:
            if self.orig_url not in link_type:
                link_type = self.orig_url + link_type

            page_num = 2
            url = link_type + 'page-' + str(page_num) + '/'
            film_url_list = self.get_film_links(url)

            while len(film_url_list) != 0:
                film_url_list = [self.orig_url + url for url in film_url_list]
                yield film_url_list

                page_num += 1
                url = link_type + 'page-' + str(page_num) + '/'
                film_url_list = self.get_film_links(url)
                break

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


    def translate_tags(self, tag_arr):
        if self.tags_dict is None:
            with open('tags.json') as tags_fp:
                self.tags_dict = json.load(tags_fp)
        tag_arr = [self.tags_dict[key] if key in self.tags_dict else key \
                    for key in tag_arr]
        return tag_arr

    def get_film_info(self, url, info_is_exists):
        page_film = parse_webpage(url)

        video_code_re = '(?<=watch/)(\\w+-){0,2}\\w*\\d+'
        video_code = re.search(video_code_re, url)
        if video_code is None or page_film is None:
            return None
        video_code = video_code.group().upper()
        search_video_code = self.code_special_case(video_code)

        view_count_re = '<div class=\"film_view_count\".*?>\\d*</div>'
        view_count_str = re.search(view_count_re, page_film).group()
        view_count_str = re.sub('<.*?>', '', view_count_str)

        model_re = '<.*>Models:.*?>.*?>'
        model = re.search(model_re, page_film).group()
        model = re.sub('<.*?>', '', model)
        model = re.sub('Models: ', '', model)

        title_re = '<title>(.*)</title>'
        title = re.search(title_re, page_film).group()
        title = re.sub('<.*?>', '', title)

        img_url_re = '<img itemprop=\"image\" src=\"(.*?)\" title=\"'
        img_url = re.search(img_url_re, page_film).group(1)

        tag_re = '<li>Genre:\\s*(.*?)</li>'
        tag = re.search(tag_re, page_film).group(1)
        tag_re = '<a.*?>(.*?)</a>'
        tag = re.findall(tag_re, tag)
        tag = self.translate_tags(tag)

        if info_is_exists:
            info = {}
            info['from'] = 'xonline'
            info['url'] = url
            info['count'] = int(view_count_str)
            info['update_date'] = datetime.datetime.now()
            info['tags'] = tag
            return info
        else:
            # filter some films don't have code number
            if search_video_code is not None:
                info_obj = get_code_info(search_video_code)
                if info_obj['model'] is not None:
                    model = info_obj['model']
                if info_obj['video_title'] is not None:
                    title = info_obj['video_title']

            info = {}
            info['from'] = 'xonline'
            info['code'] = video_code
            info['search_code'] = search_video_code
            info['url'] = url
            info['count'] = int(view_count_str)
            info['img_url'] = img_url
            info['models'] = model
            info['title'] = title
            info['update_date'] = datetime.datetime.now()
            info['tags'] = tag
            return info


if __name__ == '__main__':
    XONLINE = Xonline()
    for each in XONLINE.get_links_generator():
        for i in each:
            print(i)
