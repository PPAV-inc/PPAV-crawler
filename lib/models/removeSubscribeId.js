'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schema = require('./schema');

var removeSubscribeId = function removeSubscribeId(senderID) {
  return new Promise(function (resolve) {
    _schema.SubscribeIdCollection.remove({ senderID: senderID }, function (err) {
      if (err) {
        var str = '你尚未訂閱過喔';
        resolve(str);
      } else {
        var _str = '成功取消訂閱';
        resolve(_str);
      }
    });
  });
};

exports.default = removeSubscribeId;