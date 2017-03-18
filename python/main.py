#!/usr/bin/env python3

import json
import datetime
from mongodb import MongoOP
from xonline import Xonline
from youav import YouAV

def update_films(old_collection, update_collection, film_source):
    for url_list in film_source.get_links_generator():
        print("get films link size: {}".format(len(url_list)))
        # then parse and update url info.
        for idx, url in enumerate(url_list):
            print('\n', idx, url)
            date_info = old_collection.find_one( \
                            {'url': url, 'models': {'$ne': None}}, \
                            {'update_date':1, '_id':0})
            if date_info is None:
                date_info = update_collection.find_one( \
                                {'url': url, 'models': {'$ne': None}}, \
                                {'update_date':1, '_id':0})

            # the days difference between today and last update_date
            diff_days = 3

            if date_info is not None \
                and (datetime.date.today() - \
                    date_info['update_date'].date()).days \
                    <= diff_days:
                print("update_date is {}, skip it".format(date_info['update_date']))
            else:
                info_is_exists = bool(old_collect.find_one( \
                                        {'url': url, 'title': {'$exists': True}}))
                info = film_source.get_film_info(url, info_is_exists)

                if info_is_exists and info:
                    old_collection.update_one({'url': info['url']}, \
                                            {'$set': info}, upsert=True)
                if info:
                    print("search_code: ", info['search_code'])
                    print("models: ", info['models'])
                    update_collection.update_one({'url': info['url']}, \
                                            {'$set': info}, upsert=True)
                else:
                    print(info)

    print("update film info finished!")


if __name__ == '__main__':

    MONGO_URI = 'mongodb://localhost:27017/ppav'
    with open('../config.json') as fp:
        MONGO_URI = json.load(fp)['MONGODB_PATH']

    MONGO = MongoOP(MONGO_URI)

    # insert film information
    old_collect = MONGO.get_collection(collect_name='videos')
    update_collect = MONGO.get_collection(collect_name='videos_update')

    # update film from different web
    web_list = [YouAV()]
    for web in web_list:
        update_films(old_collect, update_collect, web)

    # find new videos
    old_url_set = set(each['url'] for each \
                 in old_collect.find({'update_date': {'$exists':True}}, \
                                        {'url':1, '_id':0}))
    update_url_set = set(each['url'] for each \
                 in update_collect.find({'update_date': {'$exists':True}}, \
                                        {'url':1, '_id':0}))
    new_url_set = update_url_set - old_url_set # get new film url set
    print("update url set size: {}".format(len(update_url_set)))
    print("old url set size: {}".format(len(old_url_set)))
    print("new url set size: {}".format(len(new_url_set)))

    print("remove all films in videos_new")
    new_collect = MONGO.get_collection(collect_name='videos_new')
    new_collect.remove({})

    # update new videos
    info_list = list(update_collect.find({'url': {'$in': list(new_url_set)}}))
    for idx, json in enumerate(info_list):
        if idx % 100 == 0 and idx > 0:
            print("update into collect {} : {} / {}". \
                    format('videos_new', idx, len(info_list)))
        old_collect.update_one({'url': json['url']}, \
                                {'$set': json}, upsert=True)
        new_collect.update_one({'url': json['url']}, \
                                {'$set': json}, upsert=True)

    print("update new collection finished!")
