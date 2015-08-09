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
var Hardware = require('./Hardware');
//var EventEmitter = require('events').EventEmitter;


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

var hardware = {};
var connections = 0;

socketio.sockets.on('connection',function(socket) {
	connections += 1;
	if(connections == 1) {
		hardware = Hardware.connect();
	}
});
server.listen(9000);
