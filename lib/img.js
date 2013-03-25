
"use strict"

var http = require('http'),
    CACHE = {},
    FILES = [ 
        'http://apps.rflab.co.za/ragingflame/img/responsive-web-design.png', 
        'http://apps.rflab.co.za/ragingflame/img/glyphicons-halflings.png' 
    ];
    
    
function getFileName(urlStr, limiter) {
    if (!urlStr) {
        return false;
    }
        
    if (urlStr.indexOf(limiter) < 0) {
        return urlStr;
    }
        
    var start = urlStr.lastIndexOf(limiter);
            
    return urlStr.substring(start + 1); 
}




function getHeader(filename) {
    var ext = getFileName(filename, '.');
        
    var headers = {
        png: "'Content-Type', 'image/png'",
        jpg: "'Content-Type', 'image/jpeg'",
        jpeg: "'Content-Type', 'image/jpeg'",
        gif: "'Content-Type', 'image/gif'"
    };
    
    if (headers.hasOwnProperty(ext)) {
        return headers[ext];
    }
    else {
        return false;
    }
}





function cache(callback) {
  var _cache   = {}
    , complete = 0

  FILES.forEach(function (filename) {
    var req, res, i = 0, content = [];

    req = http.request(filename, function(res) {

      var buffer = new Buffer(parseInt(res.header('Content-Length')))

      res.setEncoding('binary')

      res.on('data', function (chunk) {
        buffer.write(chunk, i, 'binary')
        i += chunk.length
      })

      res.on('end', function () {
        filename = getFileName(filename, '/');
        
        _cache[filename] = buffer
        if (++complete == FILES.length) {
          CACHE = _cache
          callback && callback(null, CACHE)
        }
      })

    })

    req.end()
  });

}

function img(filename, callback) {
  var contents = {}
  contents['data'] = CACHE[filename];
  contents['header'] = getHeader(filename);
  callback(null, contents);
}

module.exports = img
module.exports.cache = cache
module.exports.FILES = FILES
