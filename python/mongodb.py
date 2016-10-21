#!/usr/bin/env python3

from pymongo import MongoClient

class MongoOP:

    def __init__(self, mongo_uri='mongodb://localhost:27017/test', \
                collect_name='video_updates', old_collect_name='videos'):
        self.db = MongoClient(mongo_uri).get_default_database()
        self.collect_name = collect_name
        self.old_collect_name = old_collect_name

    def update_json_list(self, json_list, collect_name=None):
        collect = self.get_collection(collect_name)

        for json in json_list:
            collect.update_one({'url': json['url']}, {'$set': json}, upsert=True)

    def delete_url(self, url, collect_name=None):
        collect = self.get_collection(collect_name)

        collect.delete_one({'url': url})

    def info_is_exists(self, url, collect_name=None):
        collect = self.get_collection(collect_name)

        return bool(collect.find_one({'url': url, 'title': {'$exists': True}}))

    def get_unfinished_url_list(self, collect_name=None):
        collect = self.get_collection(collect_name)

        url_json_list = list(collect.find({'title': {'$exists': False}}, {'url':1, '_id':0}))
        return url_json_list

    def get_all_url_set(self, collect_name):
        collect = self.get_collection(collect_name)

        url_set = set(each['url'] for each in collect.find({}, {'url':1, '_id':0}))
        return url_set

    def get_film_info_list(self, url_list, collect_name=None):
        collect = self.get_collection(collect_name)

        info_json_list = list(collect.find({'url': {'$in': url_list}}))
        return info_json_list

    def get_collection(self, collect_name):
        if collect_name is None:
            return self.db[self.collect_name]
        else:
            return self.db[collect_name]

    def get_url_update_date(self, url, collect_name=None):
        collect = self.get_collection(collect_name)

        return collect.find_one({'url': url, 'update_date': {'$exists':True}}, \
                                {'update_date':1, '_id':0})
