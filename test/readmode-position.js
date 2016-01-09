var assert = require('assert');
var parser = require("../");
var iconv = require("iconv-lite");
var fs = require("fs");
var deepDiff = require("deep-diff");


var removeLineTag = function(string) {
	return string.replace(/\n|\r| |	/g, "");
}

describe('READ_MODE_POSITION', function () {
	describe('Test', function () {
		it('The result should be same as the Simple Test', function (done) {
			var originalReadData = parser.parse(iconv.decode(fs.readFileSync(__dirname + "/simple/simple.mht", null), "gbk"), {});

			parser.loadFile(__dirname + "/simple/simple.mht", {
				readMode: parser.constants.READ_MODE_POSITION
			}, function (err, data) {
				if (err) throw err;
				fs.open(__dirname + "/simple/simple.mht", "r", function (err, fd) {
					Object.keys(data).forEach(function (fileName) {
						var buffer = new Buffer(data[fileName].bufferLength);
						fs.readSync(fd, buffer, 0, data[fileName].bufferLength, data[fileName].startPosition);
						var convertedBuffer = removeLineTag(iconv.decode(buffer, 'gbk'));
						var comparedString = removeLineTag(iconv.decode(new Buffer(originalReadData[fileName].data), 'utf-8'));
						assert(convertedBuffer == comparedString);
					});
					done();
				});
				
			});

		});
	});

});
