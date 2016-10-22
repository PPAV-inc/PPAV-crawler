'use strict';

var _mongodb = require('../mongodb');

var _handleActions = require('../handleActions');

(0, _mongodb.findThreeNewVideos)().then(function (returnArr) {
  (0, _mongodb.findSubscribeId)().then(function (senderIDArr) {
    senderIDArr.forEach(function (senderID) {
      (0, _handleActions.sendGenericMessageByArr)(senderID, returnArr);
    });
  });
});