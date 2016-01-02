var parser = require("./parser");
module.exports = {
    parse: function (fileData, option) {
        return parser.parseByString(fileData, option);
    },
    loadFile: function (filePath, option, callback) {
        var readline = require("linebyline");
        var readStream = readline(filePath, {
            retainBuffer: true
        });
        return parser.parseByStream(readStream, option, callback);
    }
}
/*
module.exports.loadFile(__dirname + "/test/simple/simple.mht", {
            charset: "gbk",
            decodeQuotedPrintable: true
        }, function (err, data) {
            require("fs").writeFile("./aa.json", JSON.stringify(data), "utf-8")
        });
*/