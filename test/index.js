var assert = require('assert');
var parser = require("../");
var iconv = require("iconv-lite");
var fs = require("fs");
var deepDiff = require("deep-diff");


describe('Simple Test', function () {
	var json = JSON.parse(fs.readFileSync(__dirname + '/simple/simple.json', 'utf-8'));//require("./simple/simple.json");
	describe('Load file by parser', function () {
		it('json should be equal', function (done) {
			parser.loadFile(__dirname + "/simple/simple.mht", {
				charset: "gbk"
			}, function (err, data) {
				if (err) throw err;
				if (process.env.SAVE_JSON) {
					fs.writeFile(__dirname + '/simple/simple.json', JSON.stringify(data), 'utf-8');
					done();
					return;
				}
				var ret = deepDiff(data, json);
				if (typeof ret == "undefined" || ret === null) {
					done();
				} else {
					console.error(ret);
					throw "Not equal";
				}
			});
		});
	});

	describe('Load file by user', function () {
		it('json should be equal', function (done) {
			var data = parser.parse(iconv.decode(require("fs").readFileSync(__dirname + "/simple/simple.mht", null), "gbk"), {});
			var ret = deepDiff(data, json);
			if (typeof ret == "undefined" || ret === null) {
				done();
			} else {
				console.error(ret);
				throw "Not equal";
			}
		});
	});
});

describe('Remove Quoted-printable', function () {
	var json = JSON.parse(fs.readFileSync(__dirname + '/simple/simple-removedQuotedPrintable.json', 'utf-8'));//require("./simple/simple-removedQuotedPrintable.json");
	it('json should be equal', function (done) {
		parser.loadFile(__dirname + "/simple/simple.mht", {
			charset: "gbk",
			decodeQuotedPrintable: true
		}, function (err, data) {
			if (err) throw err;
			if (process.env.SAVE_JSON) {
				fs.writeFile(__dirname + '/simple/simple-removedQuotedPrintable.json', JSON.stringify(data), 'utf-8');
				done();
				return;
			}
			var ret = deepDiff(data, json);
			if (typeof ret == "undefined" || ret === null) {
				done();
			} else {
				console.error(ret);
				throw "Not equal";
			}
		});
	});

});


describe('error-versionNoSupported', function () {
	describe('Test', function () {
		it('Should throw error', function (done) {
			parser.loadFile(__dirname + "/error-versionNoSupported/test.mht", {
				charset: "gbk"
			}, function (err, data) {
				if (err) {
					done(err == "Unsupported version");
				} else {
					throw ("Didn't throw error!");
				}
			});
		});
	});

});

/*
describe('readmode-position', function () {
	describe('Test', function () {
		it('The result should be same as the simple data', function (done) {/*
			parser.loadFile(__dirname + "/error-versionNoSupported/test.mht", {
				charset: "gbk"
			}, function (err, data) {
				if (err) {
					done(err == "Unsupported version");
				} else {
					throw ("Didn't throw error!");
				}
			});
		done();
		});
	});

});
*/
