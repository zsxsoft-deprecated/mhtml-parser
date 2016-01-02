var READING_STATE_HEADER = "READING_STATE_HEADER";
var READING_STATE_PART_HEADER = "READING_STATE_PART_HEADER";
var READING_STATE_PART_CONTENT = "READING_STATE_PART_CONTENT";
var READING_STATE_INITIALIZED = "READING_STATE_INITIALIZED";
var iconv = require("iconv-lite");
var objectAssign = require('object-assign');


function getContent(key, content) {
    var colonPosition = content.indexOf(":");
    if (colonPosition < 0) return null;
    if (content.substr(0, colonPosition).toLowerCase() != key.toLowerCase()) return null;
    return content.substr(colonPosition + 1, content.length).trim();
}

function parseByString(string) {
    var ret = {
        err: null,
        data: {},
    };
    var parseLine = parse(ret);
    string.split("\n").forEach(parseLine);
    return ret;
}

function parseByStream(readStream, charset, callback) {
    var ret = {
        err: null,
        data: {},
    };
    var parseLine = parse(ret);
    var calledBack = false;
    readStream.on("line", function (line, lineIndex) {
        var parseResult = parseLine(iconv.decode(line, charset), lineIndex - 1);
        if (parseResult !== true) {
            if (!calledBack) callback({err: parseResult});
            calledBack = true;
            readStream.emit("close");
        }
    });
    readStream.on("end", function () {
        parseLine = null;
        if (!calledBack) callback(null, ret);
    })
}

function parse(ret) {

    var READING_STATE = READING_STATE_INITIALIZED;
    var boundary = "--";
    var singleObjectTemplate = {
        name: null,
        location: null,
        encoding: null,
        type: null,
        data: null,
    };
    var singleObject = null;
    var dataArray = [];

    var parseLine = function (line, lineIndex) {
        line = line.trim();
        if (line == boundary) {
            READING_STATE = READING_STATE_PART_HEADER;

            if (singleObject != null) {
                ret.data[singleObject.name] = singleObject;
                ret.data[singleObject.name].data = dataArray.join("\n");
            }
            if (Object.assign) { // PonyFill
                singleObject = Object.assign({}, singleObjectTemplate);
            } else {
                singleObject = objectAssign({}, singleObjectTemplate);
            }
            
            dataArray = [];
        }

        if (lineIndex == 0) {
            var mimeVersion = getContent("MIME-Version", line);
            if (mimeVersion != "1.0") {
                return "Unsupported version";
            }
            READING_STATE = READING_STATE_HEADER;
        } else if (READING_STATE == READING_STATE_HEADER) {
            var contentType = getContent("Content-Type", line);
            if (contentType != null) {
                var boundaryString = contentType.split("boundary=")[1];
                boundary = "--" + boundaryString.substr(1, boundaryString.length - 2);
            }
        } else if (READING_STATE == READING_STATE_PART_HEADER) {
            if (line == "" || line == "\r") {
                READING_STATE = READING_STATE_PART_CONTENT;
                return true;
            }
            var contentType = getContent("Content-Type", line);
            var contentLocation = getContent("Content-Location", line);
            var contentTransferEncoding = getContent("Content-Transfer-Encoding", line);
            if (contentType != null) {
                singleObject.type = contentType;
            } else if (contentLocation != null) {
                singleObject.location = contentLocation;
                singleObject.name = contentLocation.substr(contentLocation.lastIndexOf("/") + 1);
            } else if (contentTransferEncoding != null) {
                singleObject.encoding = contentTransferEncoding;
            }
        } else if (READING_STATE == READING_STATE_PART_CONTENT) {
            dataArray.push(line);
        }

        return true;
    }
    return parseLine;

}
module.exports = {
    parseByStream: parseByStream,
    parseByString: parseByString
};
