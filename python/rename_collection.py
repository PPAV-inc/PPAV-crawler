#!/usr/bin/python3
from mongodb import MongoOP
import time

if __name__ == '__main__':
    MONGO_URI = 'mongodb://localhost:27017/test'
    with open('../config.json') as fp:
        import json
        MONGO_URI = json.load(fp)['MONGODB_PATH']

    mongo = MongoOP(MONGO_URI)

    # rename collection
    print("Rename and drop collection in 10 sec, be careful")
    time.sleep(10)
    mongo.rename_collection(old_name='videos', new_name='videos_old', drop=True)
    mongo.rename_collection(old_name='videos_update', new_name='videos')
