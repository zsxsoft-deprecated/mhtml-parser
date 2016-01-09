var assert = require('assert');
var parser = require("../");
var iconv = require("iconv-lite");
var fs = require("fs");
var deepDiff = require("deep-diff");
var utils = require('../utils');

function newDeepDiff(lhs, rhs) {
	return deepDiff.observableDiff(lhs, rhs, function (d) {
		if (d.kind == "E" && (d.path[d.path.lenth - 1] == "startPosition" || d.path[d.path.lenth - 1] == "bufferLength")) {
			deepDiff.applyChange(lhs, rhs, d);
		}
	});
}

describe('Simple Test', function () {
	describe('Load file by parser', function () {
		it('JSON should be equal', function (done) {
			var json = JSON.parse(fs.readFileSync(__dirname + '/simple/load-file-by-parser.json', 'utf-8'));
			parser.loadFile(__dirname + "/simple/simple.mht", {
				charset: "gbk"
			}, function (err, data) {
				if (err) throw err;
				if (process.env.SAVE_JSON) {
					fs.writeFile(__dirname + '/simple/load-file-by-parser.json', JSON.stringify(data), 'utf-8');
					done();
					return;
				}
				var ret = newDeepDiff(data, json);
				if (typeof ret == "undefined" || ret === null) {
					done();
				} else {
					console.error(ret);
					throw "Not Equal";
				}
			});
		});
	});

	describe('Load file by user', function () {
		it('JSON should be equal', function (done) {
			var json = JSON.parse(fs.readFileSync(__dirname + '/simple/load-file-by-user.json', 'utf-8'));
			var data = parser.parse(iconv.decode(fs.readFileSync(__dirname + "/simple/simple.mht", null), "gbk"), {});
			if (process.env.SAVE_JSON) {
				fs.writeFile(__dirname + '/simple/load-file-by-user.json', JSON.stringify(data), 'utf-8');
				done();
				return;
			}
			var ret = newDeepDiff(data, json);
			if (typeof ret == "undefined" || ret === null) {
				done();
			} else {
				console.error(ret);
				throw "Not Equal";
			}
		});
	});
});
