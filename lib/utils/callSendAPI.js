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

exports.default = callSendAPI;