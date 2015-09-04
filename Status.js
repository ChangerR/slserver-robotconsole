var EventEmitter = require('events').EventEmitter;

var Status = function() {
	
	var _status = new EventEmitter();
	
	var _buf = '';
	
	var _patt = new RegExp(/^(\d|\w):{3}/);
	
	_status.repo = {"hdgd":0,"roll":0,"pitch":0,"yaw":0,"temp":0,"depth":0};
	
	_status.parse = function(data) {
		var _s = _buf + data;
		var _array = _s.split('\r\n');
		_s = _array.pop();

		if(_s !== '') {
			_buf = _s;
		}
		
		for (_sub in _array) {
			
			if(_patt.test(_array[_sub])) {
				//console.log(_array[_sub])
				switch (_array[_sub][0]) {
					case '7':
						//console.log('in case 7:' + _array[_sub]);
						var _subparts = _array[_sub].substring(4).split(',');
						
						for (_part in _subparts) {
							var _value = _subparts[_part].split('=');
							_status.repo[_value[0]] = _value[1];
						}
						break;
					case '9':
						var l = JSON.parse(_array[_sub].substring(4)); 
						//console.log(l);
						_status.emit(l["name"],l["args"]);
						break;
					default:
						_status.log = _array[_sub].substring(4);
				}	
			} else {
				console.log('error:' + _array[_sub]);
			}
		}
	}
	
	return _status;
}

module.exports = Status;

/*
var p = new Status();

p.on('stream_on',function() {
	console.log('hello');
});

p.parse('7:::a=1\r\n7:::b=3,c=2\r\nsdfaf');
p.parse('7:::h=1\r\n7:::e=3,d=2\r\n7:::c=4');
p.parse('\r\n9:::stream_on\r\n');
console.log(p);
*/