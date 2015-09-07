var net = require('net');

var Parse = function() {
	var _parse = {};
	var _patt = new RegExp(/^((\w|\d)|(ROVA)):{3}/);

	var _buf = '';
	
	_parse.parse = function(data,_handle) {
		var _s = _buf + data;
		var _array = _s.split(/\r?\n/);
		
	//	console.log(_array);
		_s = _array.pop();

		if(_s !== '') {
			_buf = _s;
		}
				
		for (_sub in _array) {
			
			if(_patt.test(_array[_sub])) {
				var parts = _array[_sub].split(':::');
				_handle(parts[0],parts[1]);
			} else 
				console.log('error mseeage type:[' + _array[_sub] + ']');
		} 
	}
	
	return _parse;
}

var server = net.createServer(function(conn) {
	var _p = new  Parse();
	
	console.log("now we accpet a client");
	conn.on('end',function() {
		conn.end();
		console.log("client end");
	});
	conn.on('data',function(data) {
		_p.parse(data,function(type,msg) {
			switch(type) {
				case 'ROVA':
					conn.write('SLOK:::\r\n');
					break;
				case '0':
					conn.end();
					break;
				case '9':
					if(msg === 'wifi_scan') {
						//console.log('recv wifi scan');
						var data = {};
						data.name = 'wifi_scan_results';
						data.args = [
										{
											"ssid": "gopro1234",
											"frequency": "2462",
											"signal": "-46",
											"mac": "00:00:00:00:00:00"
										},
										{
											"ssid": "406",
											"frequency": "2462",
											"signal": "-46",
											"mac": "00:00:00:00:00:00"
										},
										{
											"ssid": "gopro",
											"frequency": "2462",
											"signal": "-46",
											"mac": "00:00:00:00:00:00"
										},
										{
											"ssid": "506",
											"frequency": "2462",
											"signal": "-46",
											"mac": "00:00:00:00:00:00"
										}	
									];
						conn.write('9:::' + JSON.stringify(data) + '\r\n');
					} else if(/connect_wifi\(\w+\)/.test(msg)) {
						ssid = msg.split('(')[1].replace(/\)$/,'');
						var _d = {};
						var _args = [];
						
						_args[0] = {};
						_args[0].ssid = ssid;
						_args[0].signal = 0.6;
						_d.name = 'wifi_status';
						_d.args = _args;
						conn.write('9:::' + JSON.stringify(_d) + '\r\n');
						
						var _d1 = {};
						_d1.name = 'wifi_event_connected';
						_d1.args = ssid;
						conn.write('9:::' + JSON.stringify(_d1) + '\r\n');
					} else if(msg === 'disconnect_wifi') {
						var d = {};
						
						d.name = 'wifi_event_disconnected';
						d.args = [];
						
						conn.write('9:::' + JSON.stringify(d) + '\r\n');
					}
					break;
			}
		});
	});
	conn.on('error',function() {
		console.log("client end");
	});
	process.stdin.setEncoding('utf8');
	
	process.stdin.pipe(conn);
});

server.listen(8080,function() {
	console.log('listening at 8080');
});