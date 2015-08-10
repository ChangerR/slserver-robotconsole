$(function(){

	var poilt = function(controller) {
		console.log('slrov poilt start');
		var rov = {};
		
		rov.socket = io.connect();
		rov.throttle = 0;
		rov.yaw = 0;
		rov.lift = 0;
	
		rov.control = {
			_throttle:0,
			_yaw:0,
			_lift:0
		};
		
		rov.sendControl = function() {
			if(rov.throttle != rov.control._throttle || 
			rov.yaw != rov.control._yaw || rov.lift != rov.control._lift) {
				//console.log('go(' + rov.throttle + ',' + rov.yaw + ','+ rov.lift + ')');
				rov.control._throttle = rov.throttle;
				rov.control._yaw = rov.yaw;
				rov.control._lift = rov.lift;
				//console.log(rov.control);
				rov.socket.emit('control',rov.control);
			}
		}
		
		rov.start = function() {
			controller.bind('float','mousedown',function() {
				rov.lift = controller.get('shift').current * 1;
			});
			controller.bind('float','mouseup',function() {
				rov.lift = 0;
			});
			controller.bind('ahead','mousedown',function() {
				rov.throttle = controller.get('shift').current * 1;
			});
			controller.bind('ahead','mouseup',function() {
				rov.throttle = 0;
			});
			controller.bind('dive','mousedown',function() {
				rov.lift = controller.get('shift').current * -1;
			});
			controller.bind('dive','mouseup',function() {
				rov.lift = 0;
			});
			controller.bind('left','mousedown',function() {
				rov.yaw = controller.get('shift').current * 1;
			});
			controller.bind('left','mouseup',function() {
				rov.yaw = 0;
			});
			controller.bind('back','mousedown',function() {
				rov.throttle = controller.get('shift').current * -1;
			});
			controller.bind('back','mouseup',function() {
				rov.throttle = 0;
			});
			controller.bind('right','mousedown',function() {
				rov.yaw = controller.get('shift').current * -1;
			});
			controller.bind('right','mouseup',function() {
				rov.yaw = 0;
			});
			
			setInterval(function () {
			  rov.sendControl();
			}, 200);
			
		}
		return rov;
	}
	
	window.rov = new poilt(control);
	window.rov.start();
});