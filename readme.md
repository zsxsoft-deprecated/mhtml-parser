MHTML Parser
==================================
[![npm](https://img.shields.io/npm/v/mhtml-parser.svg)](https://www.npmjs.com/package/mhtml-parser)
[![Coverage Status](https://coveralls.io/repos/zsxsoft/mhtml-parser/badge.svg)](https://coveralls.io/r/zsxsoft/mhtml-parser)
[![Build Status](https://travis-ci.org/zsxsoft/mhtml-parser.svg?branch=master)](https://travis-ci.org/zsxsoft/mhtml-parser)
[![David deps](https://david-dm.org/zsxsoft/mhtml-parser.svg)](https://david-dm.org/zsxsoft/mhtml-parser)
[![npm](https://img.shields.io/npm/dm/mhtml-parser.svg)](https://www.npmjs.com/package/mhtml-parser)

A MHTML(.mht) file parser.

*Only tested in .mht converted by Word 2016.*

## Installion
```bash
npm install mhtml-parser --save
```

## Usage

### Parse by filename (Asynchronous)
```javascript
let parser = require('mhtml-parser');
parser.loadFile(__dirname + "/simple/simple.mht", {
    charset: "gbk" 
}, function(err, data) {
    if (err) throw err;
    console.log(data);
});
```

### Parse by filename and read content manually
```javascript
let parser = require('mhtml-parser');
let fs = require("fs");
let fileName = 'image001.jpg';

parser.loadFile(__dirname + "/simple/simple.mht", {
    charset: "gbk", 
    readMode: parser.constants.READ_MODE_POSITION
}, function(err, data) {
    if (err) throw err;
    fs.open(__dirname + "/test/simple/simple.mht", "r", function(err, fd) {
	    let buffer = new Buffer(data[fileName].bufferLength);
	    fs.readSync(fd, buffer, 0, data[fileName].bufferLength, data[fileName].startPosition); 
	    console.log(buffer.toString());
	});
});

```

### Parse by string (Synchronous)
```javascript
let parser = require('mhtml-parser');
let data = parser.parse(iconv.decode(require("fs").readFileSync(__dirname + "/simple/simple.mht", null), "gbk"), {});
```
** In this mode, ``option.readMode`` will always be ``constants.READ_MODE_ALL``.**

## Options
### charset: String
Default Value: utf-8

To convert binary data to detected charset.

### decodeQuotedPrintable: boolean
Default Value: false

To decode quoted-printable data, which is something like ``a=3D1``. See here: https://github.com/mathiasbynens/quoted-printable

### readMode
Default Value: constants.
* **READ_MODE_ALL** - Read the whole file to the memory. You can directly get each file's content from ``data.fileName.data``
* **READ_MODE_POSITION** - Scan the whole file and only get the position and length of each file but not reading them. ** Conflict with decodeQuotedPrintable.**


## Example Result
```javascript
{
	"Hey.htm": {
		"name": "Hey.htm",
		"location": "file:///C:/B133AD19/Hey.htm",
		"encoding": "quoted-printable",
		"type": "text/html; charset=\"gb2312\"",
		"data": "<html xmlns:v=3D\"urn:schemas-microsoft-com:vml\"\nxmlns:o=3D\"urn:schemas-micr>\n<li.....n<p class=3DMsoNormal><span lang=3DEN-US><o:p>&nbsp;</o:p></span></p>\n\n</div>\n\n</body>\n\n</html>",
		"startPosition": 454,
		"bufferLength": 61846
	},
	"item0001.xml": {
		"name": "item0001.xml",
		"location": "file:///C:/B133AD19/Hey.files/item0001.xml",
		"encoding": "quoted-printable",
		"type": "text/xml",
		"data": "<?xml version=3D\"1.0\" encoding=3D\"UTF-8\" standalone=3D\"no\"?><b:Sources xmln=\ns:b=3D\"http://schemas.openxmlformats.org/officeDocument/2006/bibliography\" =\nxmlns=3D\"http://schemas.openxmlformats.org/officeDocument/2006/bibliography=\n\" SelectedStyle=3D\"\\APASixthEditionOfficeOnline.xsl\" StyleName=3D\"APA\" Vers=\nion=3D\"6\"></b:Sources>",
		"startPosition": 62470,
		"bufferLength": 335
	},
	"image001.jpg": {
		"name": "image001.jpg",
		"location": "file:///C:/B133AD19/Hey.files/image001.jpg",
		"encoding": "base64",
		"type": "image/jpeg",
		"data": "/9j/4AAQSkZJRgABBDAAo...+z6EMn3aKKKoD//Z",
		"startPosition": 68533,
		"bufferLength": 12297
	}
}


```

## TODO

## License
The MIT License