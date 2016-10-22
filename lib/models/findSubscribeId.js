'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schema = require('./schema');

var findSubscribeId = function findSubscribeId() {
  return new Promise(function (resolve) {
    var senderIdArr = [];
    _schema.SubscribeIdCollection.find().forEach(function (data) {
      senderIdArr.push(data);
    });
    resolve(senderIdArr);
  });
};

exports.default = findSubscribeId;