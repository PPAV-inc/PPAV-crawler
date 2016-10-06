'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VideoCollection = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.connect('mongodb://localhost:27017/ppav');

// Create a schema
var videoSchema = new _mongoose2.default.Schema({
  id: Number,
  code: String,
  search_code: String,
  title: String,
  models: String,
  count: String,
  url: String
});

// Create a model based on the schema
var VideoCollection = exports.VideoCollection = _mongoose2.default.model('Video', videoSchema);