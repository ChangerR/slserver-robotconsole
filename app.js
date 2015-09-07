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
var statusBeat;

socketio.sockets.on('connection',function(socket) {
	connections += 1;
	if(connections == 1) {
		hardware = new Hardware();
		hardware.connect();
		
		hardware.status.on('stream_on',function(data) {
			socketio.sockets.emit('stream_on');
		});
		
		hardware.status.on('wifi_scan_results',function(data) {
			socketio.sockets.emit('wifi_scan_results',data);
		});
		
		hardware.status.on('wifi_status',function(data) {
			socketio.sockets.emit('wifi_status',data);
		});
		
		hardware.status.on('wifi_event_connected',function(data) {
			socketio.sockets.emit('wifi_event_connected',data);
		});
		
		hardware.status.on('wifi_event_disconnected',function(data) {
			socketio.sockets.emit('wifi_event_disconnected',data);
		});
		
		statusBeat = setInterval(function() {
			var status = {};
			status["hdgd"] = parseFloat(hardware.status.repo["hdgd"]);
			status["roll"] = parseFloat(hardware.status.repo["roll"]);
			status["pitch"] = parseFloat(hardware.status.repo["pitch"]);
			status["altitude"] = parseFloat(hardware.status.repo["depth"]);
			status["speed"] = 0;
			socketio.sockets.emit('navdata',status);
		},1000);
	}
	
	socket.on('control',function(data) {
		var str = 'go(' + data._throttle + ',' + data._yaw + ',' + data._lift + ')';
		hardware.write(2,str);
	});
	
	socket.on('wifi_scan',function(data) {
		//console.log('wifi_scaning');
		hardware.write(9,'wifi_scan');
	});
	
	socket.on('connect_wifi',function(data) {
		hardware.write(9,'connect_wifi(' + data + ')');
	});
	
	socket.on('disconnect_wifi',function(data) {
		hardware.write(9,'disconnect_wifi');
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
