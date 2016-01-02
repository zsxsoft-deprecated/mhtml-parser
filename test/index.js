var assert = require('assert');
var parser = require("../");
var iconv = require("iconv-lite");
var fs = require("fs");
var deepDiff = require("deep-diff");


describe('Simple Test', function() {
  var json = require("./simple/simple.json");
  describe('Load file by parser', function () {
    it('json should be equal', function (done) {
      parser.loadFile(__dirname + "/simple/simple.mht", "gbk", function(err, data) {
      	if (err) throw err;
      	done(deepDiff(data, json));
      });
    });
  });

  describe('Load file by user', function () {
    it('json should be equal', function (done) {
      var data = parser.parse(iconv.decode(require("fs").readFileSync(__dirname + "/simple/simple.mht", null), "gbk"));
      done(deepDiff(data, json));
    });
  });
});

describe('error-versionNoSupported', function() {
  describe('Test', function () {
    it('Should throw error', function (done) {
      parser.loadFile(__dirname + "/error-versionNoSupported/test.mht", "gbk", function(err, data) {
      	if (err) {
      		done(err == "Unsupported version");
      	} else {
      		throw ("Didn't throw error!");
      	}
      });
    });
  });

});

