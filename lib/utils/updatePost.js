'use strict';

var _mongodb = require('../mongodb');

var _receivedMessage = require('./receivedMessage');

(0, _mongodb.findThreeNewVideos)().then(function (returnArr) {
  (0, _mongodb.findSubscribeId)().then(function (senderIDArr) {
    senderIDArr.forEach(function (senderID) {
      (0, _receivedMessage.sendGenericMessageByArr)(senderID, returnArr);
    });
  });
});