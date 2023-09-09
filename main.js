import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GUI } from 'dat.gui'

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.setScalar(5);
camera.lookAt(scene.position);
var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);
var red = new THREE.Color('red');
var green = new THREE.Color('green');
var clock = new THREE.Clock();
var time = 0;

scene.add(new THREE.GridHelper(10, 10));

var elements = [[],[]];
var colors = [red, green];
var elem_cnt = 26
//Rings
const ringData = {
	rings:2,
	radius:3,
	offset:2
}

//Create initial geometries
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
  scene.add(e);
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
	
}

arrangeElements();


//UI ELements
const gui = new GUI()
const ringFolder = gui.addFolder('Ring')

const ringPropertiesFolder = ringFolder.addFolder('Properties')
ringPropertiesFolder
    .add(ringData, 'radius', 1, 30)
    .onChange(arrangeElements)


renderer.setAnimationLoop(() => {
  time = clock.getElapsedTime() * 0.1 * Math.PI;
  

  renderer.render(scene, camera)
});