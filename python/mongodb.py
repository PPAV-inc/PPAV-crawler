from pymongo import MongoClient


class MongoOP:
    
    def __init__(self, host='localhost:27017', db_name='PPAV'):
        self.db = MongoClient(host)[db_name]

    def update_JSON(self, json_list, collect_name):
        collect = self.db[collect_name]
        for json in json_list:
            collect.update({'url': json['url']}, json, upsert=True)

    def get_unfinished_url(self, collect_name):
        collect = self.db[collect_name]
        res = list(collect.find({'title': {'$exists': False} }, {'url':1, '_id':0}))
        return res
