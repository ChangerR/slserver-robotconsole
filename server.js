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
			if(type === 'ROVA')
				conn.write('SLOK:::\r\n');
			if(type == '0')
				conn.end();
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