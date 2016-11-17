/* VARIABLES */
var socket = io.connect();
var camera, scene, renderer;
var geometry, material, mesh;
var target = new THREE.Vector3();

/* sockets */
socket.on('connect', onSocketConnect);
socket.on('error', onSocketError);
socket.on('sendDeviceOrientation', onsendDeviceOrientation);


jQuery(document).ready(function($) {
	$(document).foundation();
	init();
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		window.addEventListener("deviceorientation", handleOrientation);
		console.log('test');
	}
	animate();
});


function init(){
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	controls = new THREE.DeviceOrientationControls( camera );
	scene = new THREE.Scene();
	var sides = [
		{
			url: '../images/01.jpg',
			position: [ -512, 0, 0 ],
			rotation: [ 0, Math.PI / 2, 0 ]
		},
		{
			url: '../images/02.jpg',
			position: [ 512, 0, 0 ],
			rotation: [ 0, -Math.PI / 2, 0 ]
		},
		{
			url: '../images/03.jpg',
			position: [ 0,  512, 0 ],
			rotation: [ Math.PI / 2, 0, Math.PI ]
		},
		{
			url: '../images/04.jpg',
			position: [ 0, -512, 0 ],
			rotation: [ - Math.PI / 2, 0, Math.PI ]
		},
		{
			url: '../images/05.jpg',
			position: [ 0, 0,  512 ],
			rotation: [ 0, Math.PI, 0 ]
		},
		{
			url: '../images/06.jpg',
			position: [ 0, 0, -512 ],
			rotation: [ 0, 0, 0 ]
		}
	];
	var cube = new THREE.Object3D();
	scene.add( cube );
	for ( var i = 0; i < sides.length; i ++ ) {
		var side = sides[ i ];
		var element = document.createElement( 'img' );
		element.width = 1026; // 2 pixels extra to close the gap.
		element.src = side.url;
		var object = new THREE.CSS3DObject( element );
		object.position.fromArray( side.position );
		object.rotation.fromArray( side.rotation );
		cube.add( object );
	}
	renderer = new THREE.CSS3DRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	//
	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
	// console.log(controls);
	// controls.update();
	// if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	// 	socket.emit("mobileDetected", controls);
	// }
	renderer.render( scene, camera );
  socket.on('sendCoords', function(data){
  	// console.log('receive');
  	// controls.deviceOrientation.alpha = data.alpha;
  	// controls.deviceOrientation.beta = data.beta;
  	// controls.deviceOrientation.gamma = data.gamma;
  	// controls.update();
  	// controls.update();
  	target.x = data.alpha;
		target.y = data.beta;
		target.z = data.gamma;
		camera.lookAt( target );
  });
}

function handleOrientation(event) {
    var orientation = {
        alpha: Math.round(event.alpha),
        beta: Math.round(event.beta),
        gamma: Math.round(event.gamma)
    };

    socket.emit('deviceOrientation', orientation);
}

function onsendDeviceOrientation(controls){
	console.log(controls);
	controls.update();
}

/* sockets */
function onSocketConnect() {
	sessionId = socket.io.engine.id;
	console.log('Connected ' + sessionId);
	//detect if the device connected is a mobile phone
};

function onSocketError(reason) {
	console.log('Unable to connect to server', reason);
};
