'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schema = require('./schema');

var saveSubscribeData = function saveSubscribeData(senderID) {
  return new Promise(function (resolve) {
    _schema.SubscribeIdCollection.count({ senderID: senderID }, function (err, count) {
      if (count > 0) {
        var str = '你已訂閱過了喔';
        resolve(str);
      } else {
        var subscribeId = new _schema.SubscribeIdCollection({
          senderID: senderID
        });

        // Save it to database
        subscribeId.save(function (errSave) {
          if (errSave) {
            console.log(errSave);
          } else {
            console.log('push ' + senderID + ' finished');
          }
        });
        var _str = '成功訂閱\n敬請期待每日新片';
        resolve(_str);
      }
    });
  });
};

exports.default = saveSubscribeData;