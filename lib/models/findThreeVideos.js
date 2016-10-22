'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schema = require('./schema');

var findThreeVideos = function findThreeVideos() {
  return new Promise(function (resolve) {
    _schema.VideoCollection.aggregate().sort({ count: -1 }).limit(50).sample(3).exec(function (err, docs) {
      resolve(docs);
    });
  });
};

exports.default = findThreeVideos;