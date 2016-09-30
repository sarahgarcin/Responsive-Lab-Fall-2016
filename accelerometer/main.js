var fs = require('fs-extra'),
	glob = require("glob"),
	path = require("path");

module.exports = function(app, io){

	console.log("main module initialized");

	io.on("connection", function(socket){

		socket.on('deviceInfo', function(data){
			// console.log(data);
			io.sockets.emit('phoneData', data);
		});

	});


// ------------- F U N C T I O N S -------------------



// - - - END FUNCTIONS - - - 
};
