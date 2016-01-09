var assert = require('assert');
var parser = require("../");
var iconv = require("iconv-lite");
var fs = require("fs");
var deepDiff = require("deep-diff");

describe('error-version-no-supported', function () {
	describe('Test', function () {
		it('Should throw error', function (done) {
			parser.loadFile(__dirname + "/error-version-no-supported/test.mht", {
				charset: "gbk"
			}, function (err, data) {
				if (err) {
					console.log(err);
					assert(err == "Unsupported version");
					done();
				} else {
					throw ("Didn't throw error!");
				}
			});
		});
	});

});
