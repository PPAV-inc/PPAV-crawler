'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _callSendAPI = require('./callSendAPI');

var _callSendAPI2 = _interopRequireDefault(_callSendAPI);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  (0, _callSendAPI2.default)(messageData);
};

exports.default = sendGenericMessage;