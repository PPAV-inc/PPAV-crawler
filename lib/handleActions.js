'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendGenericMessageByArr = exports.receivedPostback = exports.receivedMessage = undefined;

var _jsonfile = require('jsonfile');

var _jsonfile2 = _interopRequireDefault(_jsonfile);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mongodb = require('./mongodb');

var _saveLogData = require('./models/saveLogData');

var _saveLogData2 = _interopRequireDefault(_saveLogData);

var _saveSubscribeData = require('./models/saveSubscribeData');

var _saveSubscribeData2 = _interopRequireDefault(_saveSubscribeData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonPath = _path2.default.join(__dirname, '..', 'config.json');
var config = _jsonfile2.default.readFileSync(jsonPath);
var PAGE_TOKEN = config.PAGE_TOKEN;

var callSendAPI = function callSendAPI(messageData) {
  (0, _request2.default)({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_TOKEN },
    method: 'POST',
    json: messageData
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var recipientId = body.recipient_id,
          messageId = body.message_id;

      console.log('Successfully sent generic message with id ' + messageId + ' to recipient ' + recipientId);
    } else {
      console.error('Unable to send message.');
      // console.error(response);
    }
  });
};

var sendGenericMessage = function sendGenericMessage(recipientId, title, str, url, imgUrl) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [{
            title: title,
            subtitle: str,
            item_url: url,
            image_url: imgUrl,
            buttons: [{
              type: 'web_url',
              url: url,
              title: '開啟網頁'
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
};

var sendTextMessage = function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };
  callSendAPI(messageData);
};

var startedConv = function startedConv(recipientId) {
  var name = '';

  (0, _request2.default)({
    url: 'https://graph.facebook.com/v2.6/' + recipientId + '?fields=first_name',
    qs: { access_token: PAGE_TOKEN },
    method: 'GET'
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ' + error);
    } else if (response.body.error) {
      console.log('Error: ' + response.body.error);
    } else {
      name = JSON.parse(body);
      sendTextMessage(recipientId, 'Hello ' + name.first_name + ' do you have a pen?');
    }
  });
};

var sendGenericMessageByArr = function sendGenericMessageByArr(senderID, returnArr) {
  returnArr.forEach(function (value) {
    var str = '\u9EDE\u64CA\u6578\uFF1A' + value.count + '\n       \u756A\u865F\uFF1A' + value.code + '\n       \u5973\u512A\uFF1A' + value.models;
    sendGenericMessage(senderID, value.title, str, value.url, value.img_url);
  });
};

var receivedMessage = exports.receivedMessage = function receivedMessage(event) {
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
    (0, _mongodb.findThreeVideos)().then(function (returnArr) {
      sendGenericMessageByArr(senderID, returnArr);
      (0, _saveLogData2.default)(true, {
        senderID: senderID,
        messageText: messageText,
        result: 'PPAV'
      });
    });
  } else if (messageText === 'GGinin' || messageText === 'GGININ' || messageText === 'gginin') {
    (0, _saveSubscribeData2.default)(senderID).then(function (str) {
      sendTextMessage(senderID, str);
    });
  } else {
    switch (firstStr) {
      case '＃':
      case '#':
        (0, _mongodb.findVideo)('code', messageText.split(firstStr)[1].toUpperCase()).then(function (returnObj) {
          var str = '';
          if (returnObj.results.length === 0) {
            str = '搜尋不到此番號';
            sendTextMessage(senderID, str);
            (0, _saveLogData2.default)(false, {
              senderID: senderID,
              messageText: messageText,
              result: str
            });
          } else {
            str = '\u5E6B\u4F60\u641C\u5C0B\uFF1A' + returnObj.search_value;
            sendTextMessage(senderID, str);
            sendGenericMessageByArr(senderID, returnObj.results);
            (0, _saveLogData2.default)(true, {
              senderID: senderID,
              messageText: messageText,
              result: str
            });
          }
        });
        break;
      case '％':
      case '%':
        (0, _mongodb.findVideo)('models', messageText.split(firstStr)[1]).then(function (returnObj) {
          var str = '';
          if (returnObj.results.length === 0) {
            str = '搜尋不到此女優';
            sendTextMessage(senderID, str);
            (0, _saveLogData2.default)(false, {
              senderID: senderID,
              messageText: messageText,
              result: str
            });
          } else {
            str = '\u5E6B\u4F60\u641C\u5C0B\uFF1A' + returnObj.search_value;
            sendTextMessage(senderID, str);
            sendGenericMessageByArr(senderID, returnObj.results);
            (0, _saveLogData2.default)(true, {
              senderID: senderID,
              messageText: messageText,
              result: str
            });
          }
        });
        break;
      case '＠':
      case '@':
        (0, _mongodb.findVideo)('title', messageText.split(firstStr)[1]).then(function (returnObj) {
          var str = '';
          if (returnObj.results.length === 0) {
            str = '搜尋不到此片名';
            sendTextMessage(senderID, str);
            (0, _saveLogData2.default)(false, {
              senderID: senderID,
              messageText: messageText,
              result: str
            });
          } else {
            str = '\u5E6B\u4F60\u641C\u5C0B\uFF1A' + returnObj.search_value;
            sendTextMessage(senderID, str);
            sendGenericMessageByArr(senderID, returnObj.results);
            (0, _saveLogData2.default)(true, {
              senderID: senderID,
              messageText: messageText,
              result: str
            });
          }
        });
        break;
      default:
        var str = '想看片請輸入 PPAV \n\n其他搜尋功能：\n1. 搜尋番號："# + 番號" \n2. 搜尋女優："% + 女優"\n3. 搜尋片名："@ + 關鍵字"';
        sendTextMessage(senderID, str);
        break;
    }
  }
};

var receivedPostback = exports.receivedPostback = function receivedPostback(event) {
  var senderID = event.sender.id,
      recipientID = event.recipient.id,
      timeOfPostback = event.timestamp,
      payload = event.postback.payload;

  console.log('Received postback for user ' + senderID + ' and page ' + recipientID + ' with payload \'' + payload + '\' at ' + timeOfPostback);

  startedConv(senderID);
};

exports.sendGenericMessageByArr = sendGenericMessageByArr;