/*
	Hardware.js
*/
var net = require('net');
var EventEmitter = require('events').EventEmitter;

function Hardware() {
	var hardware = new EventEmitter();
	var hardwareConnected = false;
	var hardwareHandsanked = false;
	var heartbeat;

	hardware.client = {};

	hardware.connect = function() {
		hardware.client	= net.connect({port:8080},function() {
			console.log("connetct to hardware OK!");
			hardware.client.setEncoding('utf-8');
			hardware.client.write('ROVA:::\r\n');
		});

		hardware.client.on('data',function(data) {

			if(hardwareHandsanked === false) {
				if(data == 'SLOK:::\r\n') {
					hardwareHandsanked = true;
					heartbeat =	setInterval(function() {
						hardware.client.write('1:::\r\n');
					},45000);				
				}
			}else{
				var str = data.replace(/\r\n/,'');
				
			/*
				switch(str) {
				case '7:::*':
					break;
				}
			*/
			}
		});

		hardware.client.on('close',function() {
			hardwareHandsanked = false;
			console.log('socket end');
		});

	}

	hardware.write = function(channel,data) {
		var str = str(channel) + ':::' + data + '\r\n'
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
