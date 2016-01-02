MHTML Parser
==================================
[![npm](https://img.shields.io/npm/v/mhtml-parser.svg)](https://www.npmjs.com/package/mhtml-parser)
[![Coverage Status](https://coveralls.io/repos/zsxsoft/mhtml-parser/badge.svg)](https://coveralls.io/r/zsxsoft/mhtml-parser)
[![Build Status](https://travis-ci.org/zsxsoft/mhtml-parser.svg?branch=master)](https://travis-ci.org/zsxsoft/mhtml-parser)
[![David deps](https://david-dm.org/zsxsoft/mhtml-parser.svg)](https://david-dm.org/zsxsoft/mhtml-parser)
[![npm](https://img.shields.io/npm/dm/mhtml-parser.svg)](https://www.npmjs.com/package/mhtml-parser)

A MHTML(.mht) file parser.

*Only tested in .mht converted by Word 2016. Didn't remove ``3D`` and convert base64 to buffer yet.*

## Installion
```bash
npm install mhtml-parser --save
```


## Usage

### Parse by filename (Async) (Recommended)
```javascript
parser.loadFile(__dirname + "/simple/simple.mht", "gbk", function(err, data) {
    if (err) throw err;
    console.log(data);
});
```

### Parse by string (Sync)
```javascript
var data = parser.parse(iconv.decode(require("fs").readFileSync(__dirname + "/simple/simple.mht", null), "gbk"));

```

### Example Result
```javascript
{
    "err": null,
    "data": {
        "Hey.htm": {
            "name": "Hey.htm",
            "location": "file:///C:/B133AD19/Hey.htm",
            "encoding": "quoted-printable",
            "type": "text/html; charset=\"gb2312\"",
            "data": "HTML Data"
        },
        "item0001.xml": {
            "name": "item0001.xml",
            "location": "file:///C:/B133AD19/Hey.files/item0001.xml",
            "encoding": "quoted-printable",
            "type": "text/xml",
            "data": "<?xml version=3D\"1.0\" encoding=3D\"UTF-8\" standalone=3D\"no\"?><b:Sources xmln=\ns:b=3D\"http://schemas.openxmlformats.org/officeDocument/2006/bibliography\" =\nxmlns=3D\"http://schemas.openxmlformats.org/officeDocument/2006/bibliography=\n\" SelectedStyle=3D\"\\APASixthEditionOfficeOnline.xsl\" StyleName=3D\"APA\" Vers=\nion=3D\"6\"></b:Sources>"
        },
        "props002.xml": {
            "name": "props002.xml",
            "location": "file:///C:/B133AD19/Hey.files/props002.xml",
            "encoding": "quoted-printable",
            "type": "text/xml",
            "data": "<?xml version=3D\"1.0\" encoding=3D\"UTF-8\" standalone=3D\"no\"?>\n<ds:datastoreItem ds:itemID=3D\"{373E907E-BE5B-430B-A4E0-C91998BBC7EF}\" xmln=\ns:ds=3D\"http://schemas.openxmlformats.org/officeDocument/2006/customXml\"><d=\ns:schemaRefs><ds:schemaRef ds:uri=3D\"http://schemas.openxmlformats.org/offi=\nceDocument/2006/bibliography\"/></ds:schemaRefs></ds:datastoreItem>"
        },
        "themedata.thmx": {
            "name": "themedata.thmx",
            "location": "file:///C:/B133AD19/Hey.files/themedata.thmx",
            "encoding": "base64",
            "type": "application/vnd.ms-officetheme",
            "data": "=_="
        },
        "colorschememapping.xml": {
            "name": "colorschememapping.xml",
            "location": "file:///C:/B133AD19/Hey.files/colorschememapping.xml",
            "encoding": "quoted-printable",
            "type": "text/xml",
            "data": "<?xml version=3D\"1.0\" encoding=3D\"UTF-8\" standalone=3D\"yes\"?>\n<a:clrMap xmlns:a=3D\"http://schemas.openxmlformats.org/drawingml/2006/main\"=\nbg1=3D\"lt1\" tx1=3D\"dk1\" bg2=3D\"lt2\" tx2=3D\"dk2\" accent1=3D\"accent1\" accent=\n2=3D\"accent2\" accent3=3D\"accent3\" accent4=3D\"accent4\" accent5=3D\"accent5\" a=\nccent6=3D\"accent6\" hlink=3D\"hlink\" folHlink=3D\"folHlink\"/>"
        },
        "image001.jpg": {
            "name": "image001.jpg",
            "location": "file:///C:/B133AD19/Hey.files/image001.jpg",
            "encoding": "base64",
            "type": "image/jpeg",
            "data": "Base64 String"
        }
    }
}

```

## TODO
1. Auto remove ``3D`` tag
2. Auto convert base64 string to buffer

## License
The MIT License