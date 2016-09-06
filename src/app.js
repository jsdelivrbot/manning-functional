/*
from node cli ... 
node src/app.js

*/

var express = require('express');
var serveStatic = require('serve-static')
var app = express()
var path = require('path')
 


console.log(__dirname)
app.use(serveStatic(__dirname)) 


//app.use(express.static('src'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});