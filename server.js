var http = require('http');
var fs = require('fs');
var express = require('express');
var web3 = require('web3');
var app = express();

const PORT=8080;

app.use(express.static('src'));
app.get('/index-or.html', function (req, res) {

  res.sendfile(_dirname + '/index-or.html');

});

var server = app.listen(PORT, function (req, res) {
    var host = server.address().address
    var port = server.address().port
    console.log("app listening at", host, port)
});
