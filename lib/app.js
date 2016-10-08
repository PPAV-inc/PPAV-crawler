'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _mongodb = require('./mongodb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.PORT || 8080;
var VERIFY_TOKEN = _config2.default.VERIFY_TOKEN;
var PAGE_TOKEN = _config2.default.PAGE_TOKEN;

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));

var callSendAPI = function callSendAPI(messageData) {
  (0, _request2.default)({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id,
          messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      // console.error(response);
    }
  });
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
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    } else {
      name = JSON.parse(body);
      sendTextMessage(recipientId, "Hello " + name.first_name + ", do you have a pen? ");
    }
  });
};

var returnFinalStr = function returnFinalStr(senderID, returnArr) {
  returnArr.forEach(function (value) {
    var str = '片名：' + value.title + '\n' + '番號：' + value.code + '\n' + '女優：' + value.models + '\n' + value.url;
    sendTextMessage(senderID, str);
  });
};

var receivedMessage = function receivedMessage(event) {
  var senderID = event.sender.id,
      recipientID = event.recipient.id,
      timeOfMessage = event.timestamp,
      message = event.message,
      messageText = message.text,
      firstStr = messageText.split('')[0];

  console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);

  if (messageText === 'PPAV') {
    (0, _mongodb.findThreeVideos)(function (returnArr) {
      returnFinalStr(senderID, returnArr);
    });
  } else {
    switch (firstStr) {
      case '#':
        (0, _mongodb.findVideoByCode)(messageText.split(' ')[1], function (returnArr) {
          if (returnArr.length == 0) {
            var str = '搜尋不到此番號';
            sendTextMessage(senderID, str);
          } else {
            returnFinalStr(senderID, returnArr);
          }
        });
        break;

      case '@':
        (0, _mongodb.findVideoByModel)(messageText.split(' ')[1], function (returnArr) {
          var str = '';
          if (returnArr.length == 0) {
            str = '搜尋不到此女優';
            sendTextMessage(senderID, str);
          } else {
            returnFinalStr(senderID, returnArr);
          }
        });
        break;

      default:
        sendTextMessage(senderID, '想看片請輸入 PPAV');
        break;
    }
  }
};

var receivedPostback = function receivedPostback(event) {
  var senderID = event.sender.id,
      recipientID = event.recipient.id,
      timeOfPostback = event.timestamp,
      payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " + "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  startedConv(senderID);
};

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object == 'page') {
    data.entry.forEach(function (pageEntry) {
      pageEntry.messaging.forEach(function (messagingEvent) {
        if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
      });
    });

    // Must send back a 200, within 20 seconds, to let facebook know you've 
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200);
  }
});

app.use(_express2.default.static(_path2.default.join(__dirname, '/../public')));
app.listen(port, function () {
  return console.log('listening on port ' + port);
});