
"use strict"

var http = require('http'),
    CACHE = {},
    FILES = [ 
        'http://apps.rflab.co.za/ragingflame/css/css.css', 
        'http://apps.rflab.co.za/ragingflame/css/bootstrap.css' 
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





function cache(callback) {
  var _cache   = {}
    , complete = 0

  FILES.forEach(function (filename) {
    var req, res, i = 0, content = [];

    req = http.request(filename, function(res) {

      res.setEncoding('utf8')

      res.on('data', function (chunk) {
        content.push(chunk)
      })

      res.on('end', function () {
        filename = getFileName(filename, '/');
        
        _cache[filename] = content.join('');
        
        if (++complete == FILES.length) {
          CACHE = _cache
          callback && callback(null, CACHE)
        }
      })

    })

    req.end()
  });

}

function css(filename, callback) {
  var contents = {}

  callback(null, CACHE[filename]);
}

module.exports = css
module.exports.cache = cache
module.exports.FILES = FILES
