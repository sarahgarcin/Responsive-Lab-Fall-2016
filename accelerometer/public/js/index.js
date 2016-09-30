/* VARIABLES */
var socket = io.connect();

/* sockets */
socket.on('connect', onSocketConnect);
socket.on('error', onSocketError);
socket.on('phoneData', function(data){
	//console.log(data);
	var xPos = data.xPos;
	var yPos = data.yPos;
	var zPos = data.zPos;

	var xValue = map_range(xPos, -9, 10, $(window).width(), 0);
	var yValue = map_range(yPos, -9, 10, 0, $(window).height());

	$('.moving').css({
		'left': xValue,
		'top' : yValue
	});
});


jQuery(document).ready(function($) {

	$(document).foundation();
	init();
});


function init(){
		console.log($(window).width());
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		window.ondevicemotion = function(event) {
			var accelerationX = event.accelerationIncludingGravity.x;
			var accelerationY = event.accelerationIncludingGravity.y;
			var accelerationZ = event.accelerationIncludingGravity.z;
			$('.xpos').text("x: "+Math.floor(accelerationX));
			$('.ypos').text("y: "+Math.floor(accelerationY));
			$('.zpos').text("z: "+Math.floor(accelerationZ));
			socket.emit('deviceInfo', {"xPos": accelerationX,"yPos": accelerationY,"zPos": accelerationZ});
		}
	}
	// if (window.DeviceOrientationEvent) {
 //    window.addEventListener('deviceorientation', function(eventData) {
 //    	socket.emit('deviceInfo', eventData);
 //      // gamma is the left-to-right tilt in degrees
 //      console.log(eventData.gamma);

 //      // beta is the front-to-back tilt in degrees
 //      console.log(eventData.beta);

 //      // alpha is the compass direction the device is facing in degrees
 //      console.log(eventData.alpha);
 //    }, false);
	// }
	
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

/* sockets */
function onSocketConnect() {
	sessionId = socket.io.engine.id;
	console.log('Connected ' + sessionId);
};

function onSocketError(reason) {
	console.log('Unable to connect to server', reason);
};