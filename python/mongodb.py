from pymongo import MongoClient


class MongoOP:

    def __init__(self, mongo_uri='mongodb://localhost:27017/test', collect_name='video_updates', old_collect_name='videos'):
        self.db = MongoClient(mongo_uri).get_default_database()
        self.collect_name = collect_name
        self.old_collect_name = old_collect_name

    def update_json_list(self, json_list, collect_name=None):
        if collect_name is None:
            collect_name = self.collect_name
        collect = self.db[collect_name]
        for json in json_list:
            collect.update({'url': json['url']}, {'$set': json}, upsert=True)

    def remove_url(self, url, collect_name=None):
        if collect_name is None:
            collect_name = self.collect_name
        collect = self.db[collect_name]
        collect.remove({'url': url})

    def get_unfinished_url_list(self, collect_name=None):
        if collect_name is None:
            collect_name = self.collect_name
        collect = self.db[collect_name]
        url_json_list = list(collect.find({'title': {'$exists': False}}, {'url':1, '_id':0}))
        return url_json_list

    def get_old_all_url_set(self, old_collect_name=None):
        if old_collect_name is None:
            old_collect_name = self.old_collect_name
        collect = self.db[old_collect_name]

        url_set = set(each['url'] for each in collect.find({}, {'url':1, '_id':0}))
        return url_set

    def is_exists(self, url, collect_name=None):
        if collect_name is None:
            collect_name = self.collect_name
        collect = self.db[collect_name]

        return bool(collect.find({'url': url, 'title': {'$exists': True}}).count() > 0)

    def get_film_info_list(self, url_list, collect_name=None):
        if collect_name is None:
            collect_name = self.collect_name
        collect = self.db[collect_name]

        info_json_list = list(collect.find({'url': {'$in': url_list}}))
        return info_json_list
