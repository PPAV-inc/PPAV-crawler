'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonfile = require('jsonfile');

var _jsonfile2 = _interopRequireDefault(_jsonfile);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonPath = _path2.default.join(__dirname, '..', 'public', 'film_info.json');

var inArray = function inArray(arr, el) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == el) return true;
  }return false;
};

var getRandomIntNoDuplicates = function getRandomIntNoDuplicates(min, max, DuplicateArr) {
  var RandomInt = Math.floor(Math.random() * (max - min + 1)) + min;
  if (DuplicateArr.length > max - min) return false; // break endless recursion
  if (!inArray(DuplicateArr, RandomInt)) {
    DuplicateArr.push(RandomInt);
    return RandomInt;
  }
  return getRandomIntNoDuplicates(min, max, DuplicateArr);
};

var parseJson = function parseJson() {
  var obj = _jsonfile2.default.readFileSync(jsonPath);

  var duplicates = [],
      retrunArr = [];

  for (var i = 1; i <= 3; i++) {
    getRandomIntNoDuplicates(1, obj.length, duplicates);
  }

  duplicates.forEach(function (value) {
    retrunArr.push({
      'url': obj[value].url,
      'title': obj[value].title,
      'models': obj[value].models
    });
  });

  return retrunArr;
};

exports.default = parseJson;