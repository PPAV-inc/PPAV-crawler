'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _koaCompress = require('koa-compress');

var _koaCompress2 = _interopRequireDefault(_koaCompress);

var _koaConvert = require('koa-convert');

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _koaMonitor = require('koa-monitor');

var _koaMonitor2 = _interopRequireDefault(_koaMonitor);

var _webhook = require('./routes/webhook');

var _webhook2 = _interopRequireDefault(_webhook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _koa2.default();

var useRouter = function useRouter(application, router) {
  application.use(router.routes()).use(router.allowedMethods());
};

app.use((0, _koaCompress2.default)());
app.use((0, _koaBodyparser2.default)());

useRouter(app, _webhook2.default);
var server = _http2.default.createServer(app.callback());

app.use((0, _koaConvert2.default)((0, _koaMonitor2.default)(server, { path: '/status' })));

exports.default = server;