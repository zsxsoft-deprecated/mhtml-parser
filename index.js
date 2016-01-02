var parser = require("./parser");
module.exports = {
    parse: function (fileData, option) {
        return parser.parseByString(fileData);
    },
    loadFile: function (filePath, option, callback) {
        var readline = require("linebyline");
        var readStream = readline(filePath, {
            retainBuffer: true
        });
        return parser.parseByStream(readStream, option, callback);
    }
}
