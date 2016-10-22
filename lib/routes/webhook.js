'use strict';

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _jsonfile = require('jsonfile');

var _jsonfile2 = _interopRequireDefault(_jsonfile);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonPath = _path2.default.join(__dirname, '..', 'config.json');
var config = _jsonfile2.default.readFileSync(jsonPath);
var VERIFY_TOKEN = config.VERIFY_TOKEN;

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
          receivedMessage(messagingEvent);
        } else if (messagingEvent.postback) {
          // first time
          receivedPostback(messagingEvent);
        } else {
          console.log('Webhook received unknown messagingEvent: ' + messagingEvent);
        }
      });
    });

    res.sendStatus(200);
  }
});