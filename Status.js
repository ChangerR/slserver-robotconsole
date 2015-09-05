var EventEmitter = require('events').EventEmitter;

var Status = function() {
	
	var _status = new EventEmitter();
	
	var _buf = '';
	
	var _patt = new RegExp(/^((\w|\d)|(SLOK)):{3}/);
	
	_status.repo = {"hdgd":0,"roll":0,"pitch":0,"yaw":0,"temp":0,"depth":0};
	
	_status.parse = function(data,_handle) {
		var _s = _buf + data;
		var _array = _s.split(/\r?\n/);
		_s = _array.pop();

		if(_s !== '') {
			_buf = _s;
		}
		
		for (_sub in _array) {
			
			for (_sub in _array) {
			
				if(_patt.test(_array[_sub])) {
					var parts = _array[_sub].split(':::');
					_handle(parts[0],parts[1]);
				} else 
					console.log('error mseeage type:[' + _array[_sub] + ']');
			} 
		}
	}
	
	return _status;
}

module.exports = Status;
