import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as labels from './js/labels';
import * as ui from './js/ui';


const scene = new THREE.Scene();
const aspectRatio = calculateAspectRatio();
const viewSize = 15;
const camera = new THREE.OrthographicCamera(
    (viewSize * aspectRatio) / -2,
    (viewSize * aspectRatio) / 2,
    viewSize / 2,
    viewSize / -2,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//const controls = new OrbitControls(camera, renderer.domElement);
const red = new THREE.Color('red');
const green = new THREE.Color('green');
const clock = new THREE.Clock();
let time = 0;

scene.add(new THREE.GridHelper(10, 10));
const wheelGrp = new THREE.Group();

scene.add(wheelGrp);

let elements = [[],[]];
let labels_list = [[],[]];
let colors = [red, green];
let alphabet = [...Array(26)].map((x,i)=>String.fromCharCode(i + 97));
let elem_cnt = alphabet.length;

let pos = new THREE.Vector3();
let spriteOffset = new THREE.Vector3( 1, 1, 1 );




//Rings
const ringData = {
	radius:3,
	offset:1,
	rotation:0,
	lbl_offset: {x: 3.47, y: -1.59, z: 0.5}
}

ui.bindWheelCtrl(ringData, arrangeElements);

// Function to calculate the aspect ratio
function calculateAspectRatio() {
    return window.innerWidth / window.innerHeight;
}


//Create initial geometries for each color/ring
colors.forEach((c, idx) => {
	for (let i = 0; i < elem_cnt; i++) {
		var letter = alphabet[i];
	  initElement(c, idx, letter)
	}
})


//Method to set up initial geometry
function initElement(color, idx, letter) {
	console.log('--------------------------')
	console.log(color)
	console.log(color)

	let sizeOffset = 0.1*idx;
  let e = new THREE.Mesh(new THREE.CylinderGeometry(0.3+sizeOffset, 0.4+sizeOffset, 0.9), new THREE.MeshBasicMaterial({
    color: color
  }));
  e.geometry.rotateX(Math.PI * 0.5);
  wheelGrp.add(e);
  elements[idx].push(e);
  var label = labels.makeTextSprite( " " + letter + " ", { fontsize: 15, backgroundColor: {r:255, g:100, b:100, a:1} } );
	wheelGrp.add( label );
	labels_list[idx].push(label);
}

//Set Positions around center
function arrangeElements() {
	const step = (Math.PI * 2) / elements.length;
	for (let i = 0; i < colors.length; i++) {
		var offset = ringData.offset * i;
		elements[i].forEach((e, ndx) => {
			let angle = ndx * ( 2 * Math.PI / elements[i].length );
			let angleOffset = THREE.MathUtils.degToRad(ringData.rotation);
			pos.set(
					( ringData.radius + offset ) * Math.cos( angle+angleOffset )*wheelGrp.scale.x,
					( ringData.radius + offset ) * Math.sin( angle+angleOffset )*wheelGrp.scale.y,
					0
				);
			e.position.copy(pos);
			spriteOffset.set(pos.x+ringData.lbl_offset.x, pos.y+ringData.lbl_offset.y, pos.z+ringData.lbl_offset.z);
			labels_list[i][ndx].position.copy(spriteOffset);
			e.material.color.copy(colors[i]).lerpHSL(new THREE.Color("#FFF"), (ndx * 0.007));
		  e.lookAt( 0, 0, 0 );
		  
		});
	}

	//wheelGrp.rotation.z = THREE.MathUtils.degToRad(ringData.rotation);
	
}

arrangeElements();

// Set up camera and render loop
camera.position.z = 1;
camera.aspect = aspectRatio; // Update the camera's aspect ratio
camera.updateProjectionMatrix(); // Update the camera's projection matrix

renderer.setAnimationLoop(() => {
  time = clock.getElapsedTime() * 0.1 * Math.PI;
  

  renderer.render(scene, camera)
});