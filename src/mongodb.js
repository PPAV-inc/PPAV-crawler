'use strict';

import { VideoCollection } from './models/schema';

const inArray = (arr, el) => {
    for (let i = 0 ; i < arr.length; i++) 
            if(arr[i] == el) return true;
    return false;
};

export const findThreeVideos = (callback) => {

  VideoCollection.aggregate(
    {
      $sort: {
        count: -1,
      },
    },
    {
      $limit: 50,
    },
    {
      $sample: {
        size: 3
      },
    },
  ).exec(function(err, docs) {
    callback(docs);
  });
};

const escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

export const findVideo = (key, value, callback) => {
  const regex = new RegExp(escapeRegex(value), 'gi');

  VideoCollection.find().where(key, regex).exec((err, found) => {
    callback(found);
  });
};
