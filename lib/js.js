
"use strict"

var uglifyJS = require('uglify-js')
  , path     = require('path')
  , https    = require('https')
  , TAG      = 'v2.3.1'
  , CACHE    = {}
  , FILES    = [ "bootstrap-transition.js"
               , "bootstrap-affix.js"
               , "bootstrap-modal.js"
               , "bootstrap-dropdown.js"
               , "bootstrap-scrollspy.js"
               , "bootstrap-tab.js"
               , "bootstrap-tooltip.js"
               , "bootstrap-popover.js"
               , "bootstrap-alert.js"
               , "bootstrap-button.js"
               , "bootstrap-collapse.js"
               , "bootstrap-carousel.js"
               , "bootstrap-typeahead.js" ];
               


               
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

function cache() {

  var done   = 0
    , _cache = {}

  FILES.forEach(function (filename) {
    var req
      , content = []
      , options = {
          host: 'raw.github.com'
        , port: 443
        , path: path.join('/twitter/bootstrap/', TAG, '/js/', filename)
        , method: 'GET'
        }

    req = https.request(options, function(res) {

      res.setEncoding('utf8')

      res.on('data', function (chunk) {
        content.push(chunk)
      })

      res.on('end', function () {
        filename = getFileName(filename, '/');
        
        _cache[filename] = content.join('')
        if (++done == FILES.length) {
          CACHE = _cache
        }
      })
    })

    req.end()
  })

}

function js(params, callback) {
  var min, content = params.js.map(function (filename) {
    return CACHE[filename]
  }).join('\n')

  try {
    min = uglify(content, params.js)
  } catch (e) {
    min = 'Error minifying source - please open issue on http://github.com/twitter/bootstrap! thank you :)'
  }

  callback(null, {
    'js/bootstrap.js'    : new Buffer(content, 'utf8')
  , 'js/bootstrap.min.js': new Buffer(min, 'utf8')
  })
}

function uglify(input, names) {
  var content = input.replace(/[\"\']use strict[\"\']/gi, '')
    , tok = uglifyJS.parser.tokenizer(content)
    , c = tok()
    , result
    , ast

  result = '/**\n'
    + '* Bootstrap.js by @fat & @mdo\n'
    + '* plugins: ' + names.join(', ') + '\n'
    + '* Copyright 2012 Twitter, Inc.\n'
    + '* http://www.apache.org/licenses/LICENSE-2.0.txt\n'
    + '*/\n'

  ast = uglifyJS.parser.parse(content)
  ast = uglifyJS.uglify.ast_mangle(ast)
  ast = uglifyJS.uglify.ast_squeeze(ast)

  return result += uglifyJS.uglify.gen_code(ast)
}

module.exports = js
module.exports.cache = cache
module.exports.FILES = FILES
