import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as labels from './js/labels';
import * as ui from './js/ui';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.setScalar(5);
camera.lookAt(scene.position);
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const red = new THREE.Color('red');
const green = new THREE.Color('green');
const clock = new THREE.Clock();
let time = 0;

scene.add(new THREE.GridHelper(10, 10));
const wheelGrp = new THREE.Group();

scene.add(wheelGrp);

let elements = [[],[]];
let colors = [red, green];
let alphabet = [...Array(26)].map((x,i)=>String.fromCharCode(i + 97));
let elem_cnt = alphabet.length;


//Rings
const ringData = {
	radius:1,
	offset:1,
	rotation:0
}

ui.bindWheelCtrl(ringData, arrangeElements);


//Create initial geometries for each color/ring
colors.forEach((c, idx) => {
	for (let i = 0; i < elem_cnt; i++) {
	  initElement(c, idx)
	}
})


//Method to set up initial geometry
function initElement(color, idx) {
  let e = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1, 8), new THREE.MeshBasicMaterial({
    color: color
  }));
  e.geometry.rotateX(Math.PI * 0.5);
  wheelGrp.add(e);
  elements[idx].push(e);
}

//Set Positions around center
function arrangeElements() {
	const step = (Math.PI * 2) / elements.length;
	for (let i = 0; i < colors.length; i++) {
		console.log(i)
		var offset = ringData.offset * i;
		elements[i].forEach((e, ndx) => {
			let angle = ndx * ( 2 * Math.PI / elements[i].length );
			e.position.set(
				( ringData.radius + offset ) * Math.cos( angle ),
				( ringData.radius + offset ) * Math.sin( angle ),
				0
				)

			e.material.color.copy(colors[i]).lerpHSL(new THREE.Color("#FFF"), (ndx * 0.007));
		    e.lookAt(0, 0, 0);
		})
	}

	wheelGrp.rotation.z = THREE.MathUtils.degToRad(ringData.rotation);
	
}

arrangeElements();


renderer.setAnimationLoop(() => {
  time = clock.getElapsedTime() * 0.1 * Math.PI;
  

  renderer.render(scene, camera)
});