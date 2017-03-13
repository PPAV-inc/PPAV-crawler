#!/usr/bin/env python3

from pymongo import MongoClient

class MongoOP(object):

    def __init__(self, mongo_uri='mongodb://localhost:27017/ppav'):
        self.db = MongoClient(mongo_uri).get_default_database()

    def get_collection(self, collect_name):
        return self.db[collect_name]

    def get_logs(self, collect_name='logs'):
        collect = self.db[collect_name]

        for each in collect.find():
            print(each)
