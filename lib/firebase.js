'use strict';

var _jsonfile = require('jsonfile');

var _jsonfile2 = _interopRequireDefault(_jsonfile);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_firebase2.default.initializeApp(_config2.default.FIREBASE_CONFIG);

var jsonPath = _path2.default.join(__dirname, '..', 'public', 'film_info.json');

var database = _firebase2.default.database();

var pushVideoData = function pushVideoData(obj) {
  obj.forEach(function (value) {
    database.ref(value.code).set(value);
    console.log("push" + value.code + " finished");
  });
  console.log("push all finished");
};

var obj = _jsonfile2.default.readFileSync(jsonPath);
pushVideoData(obj);