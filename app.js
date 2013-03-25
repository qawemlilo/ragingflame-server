
"use strict"

var express = require('express'),  
    app     = express.createServer(), 
    types   = {};

types.img = require('./lib/img');
types.css = require('./lib/css');


function refreshCache() {
  Object.keys(types).forEach(function (type) {
    types[type].cache()
  })
}

refreshCache();
setInterval(refreshCache, 1000 * 60 * 60 * 2);



app.get('/', function (req, res) {
  res.send('Raging Flame Server - w/cache. <3');
});


app.get('/img/:image', function (req, res) {

    types.img(req.params.image, function (error, file) {
        if (file.header) {
            res.header(file.header);
            res.end(file.data);
        }
        else {
            res.end();
        }
    });

});

app.get('/css/:css', function (req, res) {

    types.css(req.params.css, function (error, data) {
        if (data) {
            res.header("Content-Type", "text/css");
            res.end(data);
        }
        else {
            res.end();
        }
    });
    
});



app.listen(process.env.PORT || 3000)