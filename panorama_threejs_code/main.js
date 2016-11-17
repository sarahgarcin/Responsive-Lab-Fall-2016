var fs = require('fs-extra'),
	glob = require("glob"),
	path = require("path");

module.exports = function(app, io){

	console.log("main module initialized");

	io.on("connection", function(socket){

		socket.on('mobileDetected', sendDeviceOrientation);
		socket.on('deviceOrientation', function(data){
      io.sockets.emit('sendCoords', data)
    });

	});


// ------------- F U N C T I O N S -------------------
	function sendDeviceOrientation(controls){
		io.sockets.emit('sendDeviceOrientation', controls);
	}


// - - - END FUNCTIONS - - - 
};
