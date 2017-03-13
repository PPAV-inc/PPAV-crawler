#!/usr/bin/env python3

from pymongo import MongoClient

class MongoOP:

    def __init__(self, mongo_uri='mongodb://localhost:27017/ppav'):
        self.db = MongoClient(mongo_uri).get_default_database()

    def get_collection(self, collect_name):
        if collect_name is None:
            return self.db[self.collect_name]
        else:
            return self.db[collect_name]

    def get_logs(self, collect_name='logs'):
        collect = self.db[collect_name]

        for each in collect.find():
            print(each)
