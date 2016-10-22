'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _callSendAPI = require('./callSendAPI');

var _callSendAPI2 = _interopRequireDefault(_callSendAPI);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sendTextMessage = function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };
  (0, _callSendAPI2.default)(messageData);
};

exports.default = sendTextMessage;