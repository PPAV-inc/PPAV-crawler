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

    var limit_num = 5;
    var set = new Set();

    while (set.size < limit_num) {
      var random_item = found[Math.floor(Math.random() * found.length)];
      set.add(random_item);
    }

    var out_arr = Array.from(set);
    callback(out_arr);
  });
};