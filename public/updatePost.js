var request = require('request');
var jsonfile = require('jsonfile');
var path = require('path');

var jsonPath = path.join(__dirname, '..', 'config.json');
var config = jsonfile.readFileSync(jsonPath);
var SERVER_ADDRESS = config.SERVER_ADDRESS;
var TEST_MESSAGE = config.TEST_MESSAGE;

var url = SERVER_ADDRESS + '/webhook';
var options = {
  method: 'post',
  body: TEST_MESSAGE,
  json: true,
  url: url
}

request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
  } else {
    console.log(error);
  }
})
