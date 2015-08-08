/*
	this file is for a slserver client
*/

var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var socketio = require('socket.io').listen(server);
var scripts = [],styles = [];
var options = [];

app.set('title','burrito-rebot');
app.use(express.static(__dirname + '/static'));
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs', { pretty: true });

app.get('/',function(req,res) {
	res.render('index', {
		title:'burrito-rebot',
		scripts:scripts,
		styles:styles
	});
});

socketio.sockets.on('connection',function(socket) {


});
server.listen(9000);
