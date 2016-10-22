'use strict';

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _receivedPostback = require('../utils/receivedPostback');

var _receivedPostback2 = _interopRequireDefault(_receivedPostback);

var _receivedMessage = require('../utils/receivedMessage');

var _receivedMessage2 = _interopRequireDefault(_receivedMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VERIFY_TOKEN = _config2.default.VERIFY_TOKEN;

var webhookRouter = new _koaRouter2.default();

webhookRouter.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

webhookRouter.post('/webhook', function (req, res) {
  var data = req.body;
  // Make sure this is a page subscription
  if (data.object === 'page') {
    data.entry.forEach(function (pageEntry) {
      pageEntry.messaging.forEach(function (messagingEvent) {
        if (messagingEvent.message) {
          (0, _receivedMessage2.default)(messagingEvent);
        } else if (messagingEvent.postback) {
          // first time
          (0, _receivedPostback2.default)(messagingEvent);
        } else {
          console.log('Webhook received unknown messagingEvent: ' + messagingEvent);
        }
      });
    });

    res.sendStatus(200);
  }
});