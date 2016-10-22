'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PAGE_TOKEN = _config2.default.PAGE_TOKEN;

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

var receivedPostback = function receivedPostback(event) {
  var senderID = event.sender.id,
      recipientID = event.recipient.id,
      timeOfPostback = event.timestamp,
      payload = event.postback.payload;

  console.log('Received postback for user ' + senderID + ' and page ' + recipientID + ' with payload \'' + payload + '\' at ' + timeOfPostback);

  startedConv(senderID);
};

exports.default = receivedPostback;