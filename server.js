/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var app = express();


// all environments
app.set('port', process.env.PORT || 3003);
app.use(express.static(__dirname));

 app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params);
     res.sendfile(__dirname); 
 });

 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});