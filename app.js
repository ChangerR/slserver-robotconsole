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
		hardware = new Hardware();
		hardware.connect();
	}
	
	socket.on('control',function(data) {
		var str = 'go(' + data._throttle + ',' + data._yaw + ',' + data._lift + ')';
		hardware.write(2,str);
	});
});

if (process.platform === 'linux') {
	process.on('SIGTERM', function () {
		if(connections >= 1) {
			hardware.close();
		}
		console.error('got SIGTERM, shutting down...');
		process.exit(0);
	});
	process.on('SIGINT', function () {
		if(connections >= 1) {
			hardware.close();
		}
		console.error('got SIGTERM, shutting down...');
		process.exit(0);
	});
}

server.listen(9000);
