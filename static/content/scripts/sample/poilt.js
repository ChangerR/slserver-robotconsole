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
		
		rov.scanWifi = function() {
			console.log("scan_wifi");
			rov.socket.emit('wifi_scan',[]);
		}
		
		rov.connectWifi = function(data) {
			rov.socket.emit('connect_wifi',data);
		}
		
		rov.wifiDisconnect = function() {
			rov.socket.emit('disconnect_wifi',[]);	
		}
		
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
			
			//controller.invoke("messageContainer", "message", "critical", "Test message on bottom right", "br");
		}
		return rov;
	}
	
	$rov = new poilt($controller);
	$rov.start();
	
	$rov.socket.on('stream_on',function() {
		var address = 'http://' + $rov.socket.io.engine.hostname + ':9000/1.jpg';
		$('#video').attr('src',address);
		//$controller.invoke("messageContainer", "message", "critical", "Test message on bottom right", "br");
	});
	
	$rov.socket.on('wifi_scan_results',function(data) {
		$controller.invoke("goProSelector", "setgopros", data);
	});
	
	$rov.socket.on('wifi_status',function(data) {
		$controller.invoke("goProInfo", "setgopro", data[0].ssid);
        $controller.invoke("goProInfo", "setsignal", data[0].signal);
	});
	
	$rov.socket.on('wifi_event_connected',function(data) {
		$controller.invoke("messageContainer", "message", "info", "ssid " + data + " has connected", "tl");
	});
	
	$rov.socket.on('wifi_event_disconnected',function(data) {
		$controller.invoke("messageContainer", "message", 'warning', "wifi has disconnected", "tl");
	});
	
	var ah = new window.HorizonDraw($rov);
	var comp = new window.HorizonCompass($rov);
});