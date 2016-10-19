from pymongo import MongoClient


class MongoOP:
    
    def __init__(self, mongo_uri='mongodb://localhost:27017/test', collect_name='videos'):
        self.db = MongoClient(mongo_uri).get_default_database()
        self.collect_name = collect_name

    def update_json_list(self, json_list, collect_name=None):
        if collect_name is None:
            collect_name = self.collect_name
        collect = self.db[collect_name]
        for json in json_list:
            collect.update({'url': json['url']}, {'$set': json}, upsert=True)

    def get_unfinished_url_list(self, collect_name=None):
        if collect_name is None:
            collect_name = self.collect_name
        collect = self.db[collect_name]
        url_json_list = list(collect.find({'title': {'$exists': False} }, {'url':1, '_id':0}))
        return url_json_list

    def get_all_url_set(self, collect_name=None):
        if collect_name is None:
            collect_name = self.collect_name
        collect = self.db[collect_name]

        url_set = set(each['url'] for each in collect.find({}, {'url':1, '_id':0}))
        return url_set

    def isExists_in_collect(self, url, collect_name=None):
        if collect_name is None:
            collect_name = self.collect_name
        collect = self.db[collect_name]

        if collect.find({'url': url, 'title': {'$exists': True}}).count() > 0:
            return True
        else:
            return False
