'use strict';

import { VideoCollection } from './models/schema';

export const findThreeVideos = (callback) => {
  VideoCollection.aggregate()
    .sort({count: -1})
    .limit(50)
    .sample(3)
    .exec((err, docs) => {
       callback(docs);
    });
};

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

export const findVideo = (key, value, callback) => {
  const regex = new RegExp(escapeRegex(value), 'gi');

  VideoCollection.find().where(key, regex).limit(5).exec((err, found) => {
    callback(found);
  });
};
