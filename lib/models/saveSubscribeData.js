'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schema = require('./schema');

var saveSubscribeData = function saveSubscribeData(senderID) {
  var SubscribeId = new _schema.subscribeIdCollection({
    senderID: senderID
  });

  // Save it to database
  SubscribeId.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('push' + senderID + ' finished');
    }
  });
};

exports.default = saveSubscribeData;