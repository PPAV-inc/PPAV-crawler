'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schema = require('./schema');

var saveLogData = function saveLogData(successOrNot, Obj) {
  var Log = void 0;
  if (successOrNot) {
    Log = new _schema.SuccessLogCollection({
      senderID: Obj.senderID,
      messageText: Obj.messageText,
      result: Obj.result
    });
  } else {
    Log = new _schema.ErrorLogCollection({
      senderID: Obj.senderID,
      messageText: Obj.messageText,
      result: Obj.result
    });
  }

  // Save it to database
  Log.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('push ' + Obj.messageText + ' finished');
    }
  });
};

exports.default = saveLogData;