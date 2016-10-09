'use strict';

var _jsonfile = require('jsonfile');

var _jsonfile2 = _interopRequireDefault(_jsonfile);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _schema = require('./schema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonPath = _path2.default.join(__dirname, '..', '..', 'public', 'film_info.json');

var saveVideoData = function saveVideoData(obj) {
  obj.forEach(function (value) {
    var Video = new _schema.VideoCollection({
      id: value.id,
      code: value.code,
      search_code: value.search_code,
      title: value.title,
      models: value.models,
      count: value.count,
      url: value.url
    });

    // Save it to database
    Video.save(function (err) {
      if (err) console.log(err);else console.log("push" + value.code + " finished");
    });
  });
};

var obj = _jsonfile2.default.readFileSync(jsonPath);
saveVideoData(obj);