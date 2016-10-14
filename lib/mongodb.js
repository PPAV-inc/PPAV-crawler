'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findVideo = exports.findThreeVideos = undefined;

var _schema = require('./models/schema');

var findThreeVideos = exports.findThreeVideos = function findThreeVideos(callback) {
  _schema.VideoCollection.aggregate().sort({ count: -1 }).limit(50).sample(3).exec(function (err, docs) {
    callback(docs);
  });
};

var escapeRegex = function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

var findVideo = exports.findVideo = function findVideo(key, value, callback) {
  var regex = new RegExp(escapeRegex(value), 'gi');

  _schema.VideoCollection.find().where(key, regex).exec(function (err, found) {
    if (found.length == 0 && key == 'models' && value.length > 1) {
      findVideo(key, value.slice(0, -1), function (returnObj) {
        callback(returnObj);
      });
    } else {
      var limit_num = 5;
      var set = new Set();

      while (found.length != 0 && set.size < limit_num) {
        var rand_num = Math.floor(Math.random() * found.length);
        set.add(found[rand_num]);
        found.splice([rand_num], 1);
      }

      var returnObj = {};
      returnObj.search_value = value;
      returnObj.results = Array.from(set);
      callback(returnObj);
    }
  });
};