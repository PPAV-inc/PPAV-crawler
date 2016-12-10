#!/usr/bin/env python3

from mongodb import MongoOP
import parser_info

if __name__ == '__main__':
    mongo_uri = 'mongodb://localhost:27017/test'
    with open('../config.json') as fp:
        import json
        mongo_uri = json.load(fp)['MONGODB_PATH']

    mongo = MongoOP(mongo_uri)
    log_collect = mongo.get_collection('logs')

    query = {}
    project = {'__v': 0, '_id': 0, 'timestamp': 0}
    sort_list = [('successOrNot', 1), ('result', 1), ('messageText', 1)]
    for each in log_collect.find(query, project, sort=sort_list):
        print(each)
    
