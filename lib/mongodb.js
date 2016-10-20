'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findSubscribeId = exports.findThreeNewVideos = exports.findVideo = exports.findThreeVideos = undefined;

var _schema = require('./models/schema');

var findSubscribeId = function findSubscribeId() {
  return new Promise(function (resolve) {
    var senderIDArr = [];
    _schema.SubscribeIdCollection.find().forEach(function (data) {
      senderIDArr.push(data);
    });
    resolve(senderIDArr);
  });
};

var findThreeNewVideos = function findThreeNewVideos() {
  return new Promise(function (resolve) {
    _schema.NewVideoCollection.aggregate().sort({ count: -1 }).limit(10).sample(3).exec(function (err, docs) {
      resolve(docs);
    });
  });
};

var findThreeVideos = function findThreeVideos() {
  return new Promise(function (resolve) {
    _schema.VideoCollection.aggregate().sort({ count: -1 }).limit(50).sample(3).exec(function (err, docs) {
      resolve(docs);
    });
  });
};

var escapeRegex = function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

var findVideo = function findVideo(key, value) {
  return new Promise(function (resolve) {
    var regex = new RegExp(escapeRegex(value), 'gi');

    _schema.VideoCollection.find().where(key, regex).exec(function (err, found) {
      if (found.length === 0 && key === 'models' && value.length > 1) {
        findVideo(key, value.slice(0, -1)).then(function (returnObj) {
          resolve(returnObj);
        });
      } else {
        var limitNum = 5;
        var set = new Set();

        while (found.length !== 0 && set.size < limitNum) {
          var randNum = Math.floor(Math.random() * found.length);
          set.add(found[randNum]);
          found.splice([randNum], 1);
        }

        var returnObj = {};
        returnObj.search_value = value;
        returnObj.results = Array.from(set);
        resolve(returnObj);
      }
    });
  });
};

exports.findThreeVideos = findThreeVideos;
exports.findVideo = findVideo;
exports.findThreeNewVideos = findThreeNewVideos;
exports.findSubscribeId = findSubscribeId;