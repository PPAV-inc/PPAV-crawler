#!/usr/bin/env python3

import re
import datetime
from parser_link import ParserLink, parse_webpage
from mongodb import MongoOP

class ParserInfo:

    def __init__(self, mongo_uri):
        self.film_infos = []
        self.mongo = MongoOP(mongo_uri)

    @classmethod
    def parse_indexav(cls, video_code):
        page_indexav = parse_webpage('https://indexav.com/search?keyword=' + video_code)
        return_obj = {}

        model_re = '<span class=\"video_actor\".*?>(.*)</span>'
        model = re.search(model_re, page_indexav)
        if model is None:
            return_obj['model'] = None
        else:
            return_obj['model'] = re.sub('<.*?>', '', model.group())

        video_title_re = '<span class=\"video_title\".*?>(.*)</span>'
        video_title = re.search(video_title_re, page_indexav)
        if video_title is None:
            return_obj['video_title'] = None
        else:
            return_obj['video_title'] = re.sub('<.*?>', '', video_title.group())

        return return_obj

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

    def parse_film_info(self, url):
        page_film = parse_webpage(url)

        video_code_re = '(?<=watch-)(\\w+-){0,2}\\w*\\d+'
        video_code = re.search(video_code_re, url)
        if video_code is None:
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

        if self.mongo.info_is_exists(url):
            info = {}
            info['url'] = url
            info['count'] = int(view_count_str)
            info['update_date'] = datetime.datetime.now()
            return info
        else:
            if search_video_code is not None:   # filter some films don't have code number
                parse_indexav_obj = self.parse_indexav(search_video_code)
                if parse_indexav_obj['model'] is not None:
                    model = parse_indexav_obj['model']
                if parse_indexav_obj['video_title'] is not None:
                    title = parse_indexav_obj['video_title']

            info = {}
            info['code'] = video_code
            info['search_code'] = search_video_code
            info['url'] = url
            info['count'] = int(view_count_str)
            info['img_url'] = img_url
            info['models'] = model
            info['title'] = title
            info['update_date'] = datetime.datetime.now()
            return info

    def parse_info_and_update(self, film_url_json_list, collect_name=None):
        for idx, url_json in enumerate(film_url_json_list):
            url = url_json['url']
            print(idx, url)
            date_info = self.mongo.get_url_update_date(url)
            diff_days = 3   # the days difference between today and last update_date

            if date_info is not None \
                and (datetime.date.today() - date_info['update_date'].date()).days <= diff_days:
                print("update_date is {}, skip it".format(date_info['update_date']))
                continue

            info = self.parse_film_info(url)
            if info:
                self.mongo.update_json_list([info], collect_name)
            else:
                self.mongo.delete_url(url, collect_name)

    def parse_start(self):
        film_url_json_list = []

        # get unfinished urls and finished it
        film_url_json_list = self.mongo.get_unfinished_url_list()
        print("unfinished url list size: {}".format(len(film_url_json_list)))
        self.parse_info_and_update(film_url_json_list)
        print("unfinished urls are done!")

        # update film information
        parser_link = ParserLink()
        for url_list in parser_link.parse_link_generator():
            print("get films link size: {}".format(len(url_list)))
            film_url_json_list = [{'url': ''.join(url.split())} for url in url_list]
            self.mongo.update_json_list(film_url_json_list)  # update url first
            self.parse_info_and_update(film_url_json_list) # then parse and update url info.

        print("update film info finished!")

        # update new video in new collection
        old_url_set = self.mongo.get_all_url_set(collect_name='videos')
        update_url_set = self.mongo.get_all_url_set(collect_name='video_updates')
        new_url_set = update_url_set - old_url_set # get new film url set
        print("link url set size: {}".format(len(update_url_set)))
        print("old url set size: {}".format(len(old_url_set)))
        print("new url set size: {}".format(len(new_url_set)))
        info_json_list = self.mongo.get_film_info_list(list(new_url_set))
        self.mongo.update_json_list(info_json_list, collect_name='newVideos')

        print("create new collection finished!")

if __name__ == '__main__':
    MONGO_URI = 'mongodb://localhost:27017/test'
    with open('../config.json') as fp:
        import json
        MONGO_URI = json.load(fp)['MONGODB_PATH']

    PARSER = ParserInfo(MONGO_URI)
    PARSER.parse_start()
