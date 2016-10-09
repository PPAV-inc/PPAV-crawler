'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findVideo = exports.findThreeVideos = undefined;

var _schema = require('./models/schema');

var inArray = function inArray(arr, el) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == el) return true;
  }return false;
};

var findThreeVideos = exports.findThreeVideos = function findThreeVideos(callback) {

  _schema.VideoCollection.aggregate({
    $sort: {
      count: -1
    }
  }, {
    $limit: 50
  }, {
    $sample: {
      size: 3
    }
  }).exec(function (err, docs) {
    callback(docs);
  });
};

var escapeRegex = function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

var findVideo = exports.findVideo = function findVideo(key, value, callback) {
  var regex = new RegExp(escapeRegex(value), 'gi');

  _schema.VideoCollection.find().where(key, regex).exec(function (err, found) {
    callback(found);
  });
};