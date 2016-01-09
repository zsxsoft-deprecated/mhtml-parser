var READING_STATE_HEADER = "READING_STATE_HEADER";
var READING_STATE_PART_HEADER = "READING_STATE_PART_HEADER";
var READING_STATE_PART_CONTENT = "READING_STATE_PART_CONTENT";
var READING_STATE_INITIALIZED = "READING_STATE_INITIALIZED";

var READ_MODE_ALL = "READ_MODE_ALL";
var READ_MODE_POSITION = "READ_MODE_POSITION";

var iconv = require("iconv-lite");
var quotedPrintable = require('quoted-printable');
var utils = require('./utils');

function getContent(key, content) {
    var colonPosition = content.indexOf(":");
    if (colonPosition < 0) return null;
    if (content.substr(0, colonPosition).toLowerCase() != key.toLowerCase()) return null;
    return content.substr(colonPosition + 1, content.length).trim();
}

function initializeOptions(unformattedOption) {
    var option = {};
    option = utils.objectAssign({}, unformattedOption);
    option.charset = option.charset || "utf-8";
    option.decodeQuotedPrintable = option.decodeQuotedPrintable || false;
    option.decodeBase64ToBuffer = option.decodeBase64ToBuffer || false;
    option.readMode = option.readMode || READ_MODE_ALL;
    return option;
}

function parseByString(string, unformattedOption) {
    var ret = {
        err: null,
        data: {},
    };
    var option = initializeOptions(unformattedOption);
    option.readMode = READ_MODE_ALL;
    var parseLine = parse(ret);
    string.split("\n").forEach(function(line, lineIndex) {
        parseLine(line, lineIndex, 0, option);
    });
    return ret;
}


function parseByStream(readStream, unformattedOption, callback) {
    var ret = {
        err: null,
        data: {},
    };
    var parseLine = parse(ret);
    var calledBack = false;
    var option = initializeOptions(unformattedOption);

    readStream.on("line", function (line, lineIndex, byteCount) {
        var parseResult = parseLine(iconv.decode(line, option.charset), lineIndex - 1, byteCount, option);
        if (parseResult !== true) {
            if (!calledBack) callback({
                err: parseResult
            });
            calledBack = true;
            readStream.emit("close");
        }
    });
    readStream.on("end", function () {
        parseLine = null;
        if (!calledBack) callback(null, ret.data);
    })
}

function parse(ret) {

    var READING_STATE = READING_STATE_INITIALIZED;
    var boundary = "--";
    var boundaryLength = 2;
    var singleObjectTemplate = {
        name: null,
        location: null,
        encoding: null,
        type: null,
        data: null,
        startPosition: 0, 
        bufferLength: 0, 
    };
    var singleObject = null;
    var dataArray = [];
    var startPosition = 0;

    var parseLine = function (line, lineIndex, byteCount, option) {

        line = line.trim();
        if (line == boundary) {

            READING_STATE = READING_STATE_PART_HEADER;

            if (singleObject != null) {
                ret.data[singleObject.name] = singleObject;

                if (option.readMode == READ_MODE_ALL) {
                    ret.data[singleObject.name].data = dataArray.join("\n").trim();

                    if (option.decodeQuotedPrintable && ret.data[singleObject.name].encoding == "quoted-printable") {
                         ret.data[singleObject.name].data = quotedPrintable.decode(ret.data[singleObject.name].data);
                    }
                }

                ret.data[singleObject.name].startPosition = startPosition;
                ret.data[singleObject.name].bufferLength = byteCount - boundaryLength - startPosition - 1 - 1; // To remove the last empty line
                startPosition = 0;

            }
            singleObject = utils.objectAssign({}, singleObjectTemplate);
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
                boundaryLength = boundary.length;
            }
        } else if (READING_STATE == READING_STATE_PART_HEADER) {
            if (line == "" || line == "\r") {
                READING_STATE = READING_STATE_PART_CONTENT;
                startPosition = byteCount + 1; // To remove the first empty line
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
                singleObject.encoding = contentTransferEncoding.toLowerCase();
            }
        } else if (READING_STATE == READING_STATE_PART_CONTENT) {
            if (option.readMode == READ_MODE_ALL) {
                dataArray.push(line);
            }
            
        }

        
        return true;
    }
    return parseLine;

}
module.exports = {
    parseByStream: parseByStream,
    parseByString: parseByString, 
    constants: {
        READ_MODE_ALL: READ_MODE_ALL,   
        READ_MODE_POSITION: READ_MODE_POSITION, 
    }
};
