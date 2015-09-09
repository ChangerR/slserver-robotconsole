/*
	Hardware.js
*/
var net = require('net');
var EventEmitter = require('events').EventEmitter;
var Status = require('./Status');

function Hardware() {
	var hardware = new EventEmitter();
	var hardwareConnected = false;
	var hardwareHandsanked = false;
	var heartbeat;
	
	hardware.status = new Status();
	
	hardware.client = {};

	hardware.connect = function() {
		hardware.client	= net.connect({host:'localhost',port:8080},function() {
			console.log("connetct to hardware OK!");
			hardware.client.setEncoding('utf-8');
			hardware.client.write('ROVA:::\r\n');
		});

		hardware.client.on('data',function(data) {
			
			hardware.status.parse(data,function(type,msg) {
				if(hardwareHandsanked === false) {
					if(type === 'SLOK') {
						hardwareHandsanked = true;
						heartbeat =	setInterval(function() {
							hardware.client.write('1:::\r\n');
						},45000);
						
						hardware.write(9,'wifi_status');
					} 
				} else {
					//console.log(type + ' ' + msg);
					switch(type) {
						case '7':
							var _subparts = msg.split(',');
							
							for (_part in _subparts) {
								var _value = _subparts[_part].split('=');
								hardware.status.repo[_value[0]] = _value[1];
							}
							break;
						case '9':
							var l = JSON.parse(msg); 
							hardware.status.emit(l["name"],l["args"]);
							break;
						default:
							hardware.status.log = msg;
					}
				}
			});
		});

		hardware.client.on('close',function() {
			hardwareHandsanked = false;
			console.log('socket end');
		});
		
		hardware.client.on('error',function() {
			hardwareHandsanked = false;
			console.log('socket occur error');
		});

	}

	hardware.write = function(channel,data) {
		var str = channel + ':::' + data + '\r\n'

		if(hardwareHandsanked)
			hardware.client.write(str);
	}

	hardware.close = function() {
		clearInterval(heartbeat);
		hardware.client.end('0:::\r\n');
	}
	
	return hardware;
}

//var dis = {};

//hardware = new Hardware(dis);
//hardware.connect();
module.exports = Hardware;
