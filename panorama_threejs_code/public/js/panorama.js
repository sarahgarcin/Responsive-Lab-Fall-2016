/* VARIABLES */
var socket = io.connect();
var deg2rad = Math.PI / 180;
var camera, scene, renderer, controls, test, sphere;
var materials = [];
var elements = [];

var $container = $('<div id="container">').appendTo('body');
var $cartel = $('<div id="cartel">').appendTo($container);


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
    checkIntersect();
    test.render(scene, camera);
    renderer.render(scene, camera);
    // sphere.rotation.y += 0.01;
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
	var folder = "images/";
	var sides = [
	    [folder + "01.jpg", 0, 0, 100, 0, 0, 0],
	    [folder + "02.jpg", 100, 0, 0, 0, 1.57, 0],
	    [folder + "03.jpg", 0, 0, -100, 0, 3.14, 0],
	    [folder + "04.jpg", -100, 0, 0, 0, 4.71, 0 ],
	    [folder + "05.jpg", 0, 100, 0, 4.71, 0, 0 ],
	    [folder + "06.jpg", 0, -100, 0, 1.57, 0, 0 ]
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
  renderer.domElement.style.zIndex = -1;
  document.body.appendChild(renderer.domElement);


	// render the sphere   
	test = new THREE.WebGLRenderer({ alpha: true });
	test.setSize(window.innerWidth, window.innerHeight);
	test.setClearColor(0xFFFFFF, 0);
	document.body.appendChild(test.domElement);

	// add description to each spheres and create them
	var description1 = "this is my first sphere";
	var description2 = "this is my second sphere";

	// the function addSphere is working like that :  addSphere(x Position, y position, z position, radius, name, description, imagefortexture)
	addSphere(0, 20, -20, 5, 'sphere1', description1, 'fire.jpg');
	addSphere(20, 0, -20, 8, 'sphere2', description2, 'texture.jpg');

}

// function to add Sphere 
function addSphere(px, py, pz, radius, name, description, texture){
	var loader = new THREE.TextureLoader();
	// loader to add texture to the sphere
	loader.load("images/"+texture, function ( texture ) {
    var geometry = new THREE.SphereGeometry( radius, 32, 32 );
    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.z = pz;
		sphere.position.y = py;
		sphere.position.x = px;
		sphere.name = name;
		sphere.description = description;
		scene.add( sphere );
		// push all spheres in the elements array
		elements.push(sphere);
	} );
}

// Check if the camera if looking at the object
function checkIntersect(){
  // create a Ray with origin at the mouse position
  //   and direction into the scene (camera direction)
  var vector = new THREE.Vector3( camera.position.x, camera.position.y, 1 );
  vector.unproject(camera);
  var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

  // create an array containing all objects in the scene with which the ray intersects
  var intersects = ray.intersectObjects(elements); //scene.children

  // INTERSECTED = the object in the scene currently closest to the camera
  //		and intersected by the Ray projected from the mouse position

  // if there is one (or more) intersections
  if ( intersects.length > 0 ){
    // console.log('there is intersects', intersects);
    // if the closest object intersected is not the currently stored intersection object
    if ( intersects[0].object != INTERSECTED ){
      // restore previous intersection object (if it exists) to its original color
      // if ( INTERSECTED )
      // store reference to closest object as current intersection object
      INTERSECTED = intersects[ 0 ].object;

      console.log('new intersect', INTERSECTED);

      // update text, if it has a "name" field.
      if ( INTERSECTED.name ){
      	// If he find the object it displays the info box and fill it with the right info
        fillCartel(INTERSECTED);
        showCartel();
      }else{
        hideCartel();
      }
    }
  }
  else{ // there are no intersections
    console.log('there is not intersetcs');
    hideCartel();
    INTERSECTED = null;
  }
};

// fill the cartel with the text(cartel in french is for the little notices you have in exhibition)
function fillCartel (object){
  console.log('fillCartel', object);
  $cartel.empty();
  var content = "<h2>"+object.name+"</h2><p>"+object.description+"</p>";
  $cartel.append(content);
}

function showCartel (){
  $container.css('display', 'block');
}

function hideCartel (){
  $container.css('display', 'none');
}


/* sockets */
function onSocketConnect() {
	sessionId = socket.io.engine.id;
	console.log('Connected ' + sessionId);
};

function onSocketError(reason) {
	console.log('Unable to connect to server', reason);
};
