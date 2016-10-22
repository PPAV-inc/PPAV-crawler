'use strict';

var _findThreeNewVideos = require('../models/findThreeNewVideos');

var _findThreeNewVideos2 = _interopRequireDefault(_findThreeNewVideos);

var _findSubscribeId = require('../models/findSubscribeId');

var _findSubscribeId2 = _interopRequireDefault(_findSubscribeId);

var _receivedMessage = require('./receivedMessage');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _findThreeNewVideos2.default)().then(function (returnArr) {
  (0, _findSubscribeId2.default)().then(function (senderIDArr) {
    senderIDArr.forEach(function (senderID) {
      (0, _receivedMessage.sendGenericMessageByArr)(senderID, returnArr);
    });
  });
});