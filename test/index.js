var assert = require('assert');
var parser = require("../");
var iconv = require("iconv-lite");
var fs = require("fs");
var deepDiff = require("deep-diff");


describe('Simple Test', function() {
  var json = require("./simple/simple.json");
  describe('Load file by parser', function () {
    it('json should equal', function (done) {
      parser.loadFile(__dirname + "/simple/simple.mht", "gbk", function(err, data) {
      	if (err) throw err;
      	done(deepDiff(data, json));
      });
    });
  });

  describe('Load file by user', function () {
    it('json should equal', function (done) {
      var data = parser.parse(iconv.decode(require("fs").readFileSync(__dirname + "/simple/simple.mht", null), "gbk"));
      done(deepDiff(data, json));
    });
  });
});
