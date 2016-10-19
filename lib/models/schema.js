'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeIdCollection = exports.SuccessLogCollection = exports.ErrorLogCollection = exports.VideoCollection = undefined;

var _jsonfile = require('jsonfile');

var _jsonfile2 = _interopRequireDefault(_jsonfile);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonPath = _path2.default.join(__dirname, '..', '..', 'config.json');
var config = _jsonfile2.default.readFileSync(jsonPath);
_mongoose2.default.connect(config.MONGODB_PATH);

var videoSchema = new _mongoose2.default.Schema({
  id: Number,
  code: String,
  search_code: String,
  title: String,
  models: String,
  count: Number,
  url: String,
  img_url: String
});

var errorLogSchema = new _mongoose2.default.Schema({
  senderID: String,
  messageText: String,
  result: String
});

var successLogSchema = new _mongoose2.default.Schema({
  senderID: String,
  messageText: String,
  result: String
});

var subscribeIdSchema = new _mongoose2.default.Schema({
  senderID: String
});

var VideoCollection = exports.VideoCollection = _mongoose2.default.model('Video', videoSchema);
var ErrorLogCollection = exports.ErrorLogCollection = _mongoose2.default.model('ErrorLog', errorLogSchema);
var SuccessLogCollection = exports.SuccessLogCollection = _mongoose2.default.model('SuccessLog', successLogSchema);
var subscribeIdCollection = exports.subscribeIdCollection = _mongoose2.default.model('SubscribeId', subscribeIdSchema);