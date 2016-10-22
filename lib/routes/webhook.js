'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _receivedPostback = require('../utils/receivedPostback');

var _receivedPostback2 = _interopRequireDefault(_receivedPostback);

var _receivedMessage = require('../utils/receivedMessage');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var VERIFY_TOKEN = _config2.default.VERIFY_TOKEN;

var webhookRouter = new _koaRouter2.default();

webhookRouter.get('/webhook', function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx) {
    var req, res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            req = ctx.request;
            res = ctx.response;

            if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
              res.body = req.query['hub.challenge'];
            } else {
              res.body = 'Error, wrong validation token';
            }

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

webhookRouter.post('/webhook', function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
    var data;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            data = ctx.request.body;


            if (data.object === 'page') {
              data.entry.forEach(function (pageEntry) {
                pageEntry.messaging.forEach(function (messagingEvent) {
                  if (messagingEvent.message) {
                    (0, _receivedMessage.receivedMessage)(messagingEvent);
                  } else if (messagingEvent.postback) {
                    // first time
                    (0, _receivedPostback2.default)(messagingEvent);
                  } else {
                    console.log('Webhook received unknown messagingEvent: ' + messagingEvent);
                  }
                });
              });
              ctx.response.body = 200;
            }

          case 2:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());

exports.default = webhookRouter;