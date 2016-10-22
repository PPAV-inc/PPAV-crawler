'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schema = require('./schema');

var findThreeNewVideos = function findThreeNewVideos() {
  return new Promise(function (resolve) {
    _schema.NewVideoCollection.aggregate().sort({ count: -1 }).limit(10).sample(3).exec(function (err, docs) {
      resolve(docs);
    });
  });
};

exports.default = findThreeNewVideos;