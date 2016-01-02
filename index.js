var parser = require("./parser");
module.exports = {
    parse: function (fileData) {
        return parser.parseByString(fileData);
    },
    loadFile: function (filePath, charset, callback) {
        var readline = require("linebyline");
        var readStream = readline(filePath, {
            retainBuffer: true
        });
        return parser.parseByStream(readStream, charset, callback);
    }
}
