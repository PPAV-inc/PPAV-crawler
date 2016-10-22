'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sendGenericMessage = require('./sendGenericMessage');

var _sendGenericMessage2 = _interopRequireDefault(_sendGenericMessage);

var _sendTextMessage = require('./sendTextMessage');

var _sendTextMessage2 = _interopRequireDefault(_sendTextMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sendGenericMessageByArr = function sendGenericMessageByArr(senderID, returnArr) {
  returnArr.forEach(function (value) {
    var str = '\u9EDE\u64CA\u6578\uFF1A' + value.count + '\n       \u756A\u865F\uFF1A' + value.code + '\n       \u5973\u512A\uFF1A' + value.models;
    (0, _sendGenericMessage2.default)(senderID, value.title, str, value.url, value.img_url);
  });
};

var receivedMessage = function receivedMessage(event) {
  var senderID = event.sender.id,
      recipientID = event.recipient.id,
      timeOfMessage = event.timestamp,
      message = event.message;

  var firstStr = '',
      messageText = message.text;

  if (messageText !== undefined) {
    firstStr = messageText.split('')[0];
    messageText = messageText.replace(/\s/g, '');
  }

  console.log('Received message for user ' + senderID + ' and page ' + recipientID + ' at ' + timeOfMessage + ' with message:');

  if (messageText === 'PPAV' || messageText === 'ppav' || messageText === 'Ppav') {
    findThreeVideos().then(function (returnArr) {
      sendGenericMessageByArr(senderID, returnArr);
      saveLogData(true, {
        senderID: senderID,
        messageText: messageText,
        result: 'PPAV'
      });
    });
  } else if (messageText === 'GGinin' || messageText === 'GGININ' || messageText === 'gginin') {
    saveSubscribeData(senderID).then(function (str) {
      (0, _sendTextMessage2.default)(senderID, str);
    });
  } else if (messageText === 'NoGG' || messageText === 'NOGG' || messageText === 'nogg' || messageText === 'noGG') {
    removeSubscribeId(senderID).then(function (str) {
      (0, _sendTextMessage2.default)(senderID, str);
    });
  } else {
    switch (firstStr) {
      case '＃':
      case '#':
        findVideo('code', messageText.split(firstStr)[1].toUpperCase()).then(function (returnObj) {
          var str = '';
          if (returnObj.results.length === 0) {
            str = '搜尋不到此番號';
            (0, _sendTextMessage2.default)(senderID, str);
            saveLogData(false, {
              senderID: senderID,
              messageText: messageText,
              result: str
            });
          } else {
            str = '\u5E6B\u4F60\u641C\u5C0B\uFF1A' + returnObj.search_value;
            (0, _sendTextMessage2.default)(senderID, str);
            sendGenericMessageByArr(senderID, returnObj.results);
            saveLogData(true, {
              senderID: senderID,
              messageText: messageText,
              result: str
            });
          }
        });
        break;
      case '％':
      case '%':
        findVideo('models', messageText.split(firstStr)[1]).then(function (returnObj) {
          var str = '';
          if (returnObj.results.length === 0) {
            str = '搜尋不到此女優';
            (0, _sendTextMessage2.default)(senderID, str);
            saveLogData(false, {
              senderID: senderID,
              messageText: messageText,
              result: str
            });
          } else {
            str = '\u5E6B\u4F60\u641C\u5C0B\uFF1A' + returnObj.search_value;
            (0, _sendTextMessage2.default)(senderID, str);
            sendGenericMessageByArr(senderID, returnObj.results);
            saveLogData(true, {
              senderID: senderID,
              messageText: messageText,
              result: str
            });
          }
        });
        break;
      case '＠':
      case '@':
        findVideo('title', messageText.split(firstStr)[1]).then(function (returnObj) {
          var str = '';
          if (returnObj.results.length === 0) {
            str = '搜尋不到此片名';
            (0, _sendTextMessage2.default)(senderID, str);
            saveLogData(false, {
              senderID: senderID,
              messageText: messageText,
              result: str
            });
          } else {
            str = '\u5E6B\u4F60\u641C\u5C0B\uFF1A' + returnObj.search_value;
            (0, _sendTextMessage2.default)(senderID, str);
            sendGenericMessageByArr(senderID, returnObj.results);
            saveLogData(true, {
              senderID: senderID,
              messageText: messageText,
              result: str
            });
          }
        });
        break;
      default:
        var str = '想看片請輸入 PPAV \n\n其他搜尋功能：\n1. 搜尋番號："# + 番號" \n2. 搜尋女優："% + 女優"\n3. 搜尋片名："@ + 關鍵字"';
        (0, _sendTextMessage2.default)(senderID, str);
        break;
    }
  }
};

exports.default = receivedMessage;