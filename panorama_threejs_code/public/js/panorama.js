/* VARIABLES */
var socket = io.connect();
var deg2rad = Math.PI / 180;
var camera, scene, renderer, controls;


/* sockets */
socket.on('connect', onSocketConnect);
socket.on('error', onSocketError);


jQuery(document).ready(function($) {
	$(document).foundation();
	init();
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		window.addEventListener("deviceorientation", handleOrientation);
	}
	animate();
});

var animate = function(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    socket.on('sendCoords', function(data){
			camera.rotation.set (
	      !data.beta  ? 0 : data.beta * deg2rad,
	      !data.gamma ? 0 : data.gamma * deg2rad,
	      !data.alpha ? 0 : data.alpha * deg2rad
			);
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

function init(){
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
	camera.eulerOrder = "ZXY";

	scene = new THREE.Scene();
	var folder = "http://learningthreejs.com/data/lets_do_a_sky/images/Bridge2/";
	var sides = [
	    [folder + "posz.jpg", 0, 0, 100, 0, 0, 0],
	    [folder + "posx.jpg", 100, 0, 0, 0, 1.57, 0],
	    [folder + "negz.jpg", 0, 0, -100, 0, 3.14, 0],
	    [folder + "negx.jpg", -100, 0, 0, 0, 4.71, 0 ],
	    [folder + "negy.jpg", 0, 100, 0, 4.71, 0, 0 ],
	    [folder + "posy.jpg", 0, -100, 0, 1.57, 0, 0 ]
	];

	var cube = new THREE.CSS3DObject( document.createElement('div') );
	for (var i = 0; i < sides.length; i ++) {
	    var element = document.createElement('img');
	    element.src = sides[i][0];
	    element.style.width = '800px';
	    element.style.height = '800px';
	    
	    var object = new THREE.CSS3DObject(element);
	    object.position.set(
	        sides[i][1],
	        sides[i][2],
	        sides[i][3]
	    );
	    object.rotation.set(
	        sides[i][4],
	        sides[i][5],
	        sides[i][6]
	    );
	    object.scale.set(
	        0.25,
	        0.25,
	        1
	    );
	    cube.add(object);
	}
	cube.rotation.x = -90;
	scene.add(cube);

	camera.rotation.set (1,0,0);


  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = 0;
  document.body.appendChild(renderer.domElement);
}


/* sockets */
function onSocketConnect() {
	sessionId = socket.io.engine.id;
	console.log('Connected ' + sessionId);
};

function onSocketError(reason) {
	console.log('Unable to connect to server', reason);
};