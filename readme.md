MHTML Parser
==================================
[![npm](https://img.shields.io/npm/v/mhtml-parser.svg)](https://www.npmjs.com/package/mhtml-parser)
[![Coverage Status](https://coveralls.io/repos/zsxsoft/mhtml-parser/badge.svg)](https://coveralls.io/r/zsxsoft/mhtml-parser)
[![Build Status](https://travis-ci.org/zsxsoft/mhtml-parser.svg?branch=master)](https://travis-ci.org/zsxsoft/mhtml-parser)
[![David deps](https://david-dm.org/zsxsoft/mhtml-parser.svg)](https://david-dm.org/zsxsoft/mhtml-parser)
[![npm](https://img.shields.io/npm/dm/mhtml-parser.svg)](https://www.npmjs.com/package/mhtml-parser)

A MHTML(.mht) file parser.

*Only tested in .mht converted by Word 2016. Didn't convert base64 to buffer yet.*

## Installion
```bash
npm install mhtml-parser --save
```

## Usage

### Parse by filename (Async) (Recommended)
```javascript
parser.loadFile(__dirname + "/simple/simple.mht", {
    charset: "gbk" 
}, function(err, data) {
    if (err) throw err;
    console.log(data);
});
```

### Parse by string (Sync)
```javascript
var data = parser.parse(iconv.decode(require("fs").readFileSync(__dirname + "/simple/simple.mht", null), "gbk"), {});

```

### Example
#### Example Option 
```javascript
{
    charset: "gbk", // default: utf-8 
    decodeQuotedPrintable: true, // default: false, see: https://github.com/mathiasbynens/quoted-printable
    
}
```

#### Example Result
```javascript
{
    "err": null,
    "data": {
        "Hey.htm": {
            "name": "Hey.htm",
            "location": "file:///C:/B133AD19/Hey.htm",
            "encoding": "quoted-printable",
            "type": "text/html; charset=\"gb2312\"",
            "data": ".....<span\nlang=EN-US>Hey, I’m zsx!</span></p>\n\n<p class=MsoNormal><span style='font-family:等线;mso-ascii-font-family:Calibri;\nmso-ascii-theme-font:minor-latin;mso-fareast-font-family:等线;mso-fareast-theme-font:\nminor-fareast;mso-hansi-font-family:Calibri;mso-hansi-theme-font:minor-latin'>我只是在测试文件而已（笑）</span></p>..."
        },
        "item0001.xml": {
            "name": "item0001.xml",
            "location": "file:///C:/B133AD19/Hey.files/item0001.xml",
            "encoding": "quoted-printable",
            "type": "text/xml",
            "data": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><b:Sources xmlns:b=\"http://schemas.openxmlformats.org/officeDocument/2006/bibliography\" xmlns=\"http://schemas.openxmlformats.org/officeDocument/2006/bibliography\" SelectedStyle=\"\\APASixthEditionOfficeOnline.xsl\" StyleName=\"APA\" Version=\"6\"></b:Sources>"
        },
        "props002.xml": {
            "name": "props002.xml",
            "location": "file:///C:/B133AD19/Hey.files/props002.xml",
            "encoding": "quoted-printable",
            "type": "text/xml",
            "data": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<ds:datastoreItem ds:itemID=\"{373E907E-BE5B-430B-A4E0-C91998BBC7EF}\" xmlns:ds=\"http://schemas.openxmlformats.org/officeDocument/2006/customXml\"><ds:schemaRefs><ds:schemaRef ds:uri=\"http://schemas.openxmlformats.org/officeDocument/2006/bibliography\"/></ds:schemaRefs></ds:datastoreItem>"
        },
        "themedata.thmx": {
            "name": "themedata.thmx",
            "location": "file:///C:/B133AD19/Hey.files/themedata.thmx",
            "encoding": "base64",
            "type": "application/vnd.ms-officetheme",
            "data": "Base64 String"
        },
        "colorschememapping.xml": {
            "name": "colorschememapping.xml",
            "location": "file:///C:/B133AD19/Hey.files/colorschememapping.xml",
            "encoding": "quoted-printable",
            "type": "text/xml",
            "data": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n<a:clrMap xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\"bg1=\"lt1\" tx1=\"dk1\" bg2=\"lt2\" tx2=\"dk2\" accent1=\"accent1\" accent2=\"accent2\" accent3=\"accent3\" accent4=\"accent4\" accent5=\"accent5\" accent6=\"accent6\" hlink=\"hlink\" folHlink=\"folHlink\"/>"
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
1. Auto convert base64 string to buffer

## License
The MIT License