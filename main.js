import * as THREE from 'three';
import { gsap } from "gsap";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as labels from './js/labels';
import * as ui from './js/ui';
import * as postprocess from './js/postprocess';
import * as cipher from './js/chaocipher';
import { shuffle } from './js/utils';
import { loadFont, textMesh, translateLetter } from './js/cipher_text';

const scene = new THREE.Scene();
const aspectRatio = calculateAspectRatio();
const viewSize = 15;
const camera = new THREE.OrthographicCamera(
    (viewSize * aspectRatio) / -2,
    (viewSize * aspectRatio) / 2,
    viewSize / 2,
    viewSize / -2,
    0.1,
    50
);

const renderer = new THREE.WebGLRenderer();
renderer.antialias = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const red = new THREE.Color('red');
const green = new THREE.Color('green');
const clock = new THREE.Clock();
let time = 0;

let wheelGrp = new THREE.Group();
scene.add(wheelGrp);
let letterGrp = new THREE.Group();
scene.add(letterGrp);

let elements = [[],[]];
let labels_list = [[],[]];
let colors = [red, green];
let alphabet = [...Array(26)].map((e,i)=>(i+10).toString(36));
let elem_cnt = alphabet.length;
let mat_outline = new THREE.LineBasicMaterial({ color: "black", linewidth: 10 });
//Variable that handles ALL element Positions 
let pos = new THREE.Vector3();
let btns = [];
let selectedObjects = [];

//navigation
// Initialize the mouse vector
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const debug_1 = "ZPAOEQYUJFIKGDXCHBRTMLNWSV";
const debug_2 = "ECZVWMBXKJQSNTHDIUPOALRGFY";
const debug_letters = [debug_1, debug_2];
const fontPath = 'fonts/Generic_Techno_Regular.json'
let FONT = undefined;//loaded with on font load
loadFont(fontPath, onFontLoad);


const appData = {
  DEBUG: false,
  USE_LABELS: false
};

//Rings
const ringData = {
	radius:3,
	offset:1,
	rotation:0,
	lbl_offset: {x: 3.7, y: -1.69, z: 0.5}
};

let cipherData = {
	ciphers: cipher.createCiphers(colors.length),
  text_in: "",
  text_out: ""
};

let letters = {};

const ctrls = [];

let zenith = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), new THREE.MeshBasicMaterial({
    color: 'white',
    wireframe: true
}));

addUserData( zenith, 'ZENITH', zenith.material.color, 0, undefined );

let nadir = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), new THREE.MeshBasicMaterial({
    color: 'white',
    wireframe: true
}));

addUserData( nadir, 'NADIR', nadir.material.color, 0, undefined );

ctrls.push(zenith);
ctrls.push(nadir);

postprocess.init(scene, camera, renderer);

let outlineData = postprocess.getOutlineData();

//Set up ui
ui.bindAppCtrls(appData, onUpdateAppCtrls);
ui.bindWheelCtrl(ringData, arrangeElements);
ui.bindOutlineCtrl(outlineData, postprocess.updateOutline);
ui.bindCipherCtrl(cipherData, onUpdateCipherCtrls);

// Function to calculate the aspect ratio
function calculateAspectRatio() {
    return window.innerWidth / window.innerHeight;
}

function insertAndShift(arr, from, to) {
    let cutOut = arr.splice(from, 1) [0];
    arr.splice(to, 0, cutOut);
}

function addUserData(elem, tag, color, index, letter, follower=undefined){
	elem.userData = {'tag': tag, 'color': color, 'index': index, 'letter': letter, 'follower':follower};
}

function styleToRGB(style){
	let result = style.replace('rgb(','');
	result = result.replace(')','').split(',');

	return result
}

function buildRings(){
	labels_list.forEach((list, idx) => {
		list.forEach((label, idx) => {
			if(label!=undefined){
				label.geometry.dispose();
				label.material.map.dispose();
				label.material.dispose();
			}
		});
	});

	wheelGrp.children.forEach((child, idx) => {
		child.geometry.dispose();
		child.material.dispose();
	});

	scene.remove(wheelGrp);
	wheelGrp = new THREE.Group();
	scene.add(wheelGrp);

	elements = [[],[]];
	letters = [[], []];
	labels_list = [[],[]];

	//Create initial geometries for each color/ring
	colors.forEach((c, cdx) => {
		for (let i = 0; i < elem_cnt; i++) {
			var letter = cipherData.ciphers[cdx][i];

			if(appData.DEBUG){
				letter = debug_letters[cdx][i];
			}
		  initElement(c, cdx, i, letter);
		}
	});
}

//Method to set up initial geometry
function initElement(color, cdx, idx, letter) {
	var rgb = styleToRGB(color.getStyle());

	let sizeOffset = 0.1*cdx;
  let e = new THREE.Mesh(new THREE.CylinderGeometry(0.3+sizeOffset, 0.4+sizeOffset, 0.9, 4), new THREE.MeshBasicMaterial({
    color: color,
    wireframe: true,
    transparent: true,
    opacity: 0.2
  }));

  let tMesh = textMesh(letter, FONT, 0.5, 0.1);
  addUserData( tMesh, 'TEXT_MESH', colors[cdx], idx, letter );
  letters[cdx].push( tMesh );
  letterGrp.add( tMesh );

  e.geometry.rotateX(Math.PI * 0.5);
  addUserData( e, 'BTN_MESH', colors[cdx], idx, letter, tMesh );
  btns.push(e);
  wheelGrp.add(e);
  elements[cdx].push(e);

  if(appData.USE_LABELS){
  	var label = labels.makeTextSprite( " " + letter.toUpperCase() + " ", { fontsize: 16, backgroundColor: {r:parseFloat(rgb[0]), g:parseFloat(rgb[1]), b:parseFloat(rgb[2]), a:0}, borderColor: {r:100, g:100, b:100, a: 0} } );
	  addUserData( label, 'LABEL', colors[cdx], idx, letter );
		wheelGrp.add( label );
		labels_list[cdx].push( label );
  }
  
	wheelGrp.add( zenith );
	wheelGrp.add( nadir );
}

//Arrange cipher wheels
function arrangeElements() {
	const step = (Math.PI * 2) / elements.length;
	for (let i = 0; i < colors.length; i++) {
		var offset = ringData.offset * i;
		var indRad = zenith.geometry.parameters.radius;
		var indOffset = ((indRad*2) + ringData.radius + offset) * i;
		pos.set(0, indOffset, 0);
		zenith.position.copy(pos);
		pos.set(0, -indOffset, 0);
		nadir.position.copy(pos)
		elements[i].forEach((e, ndx) => {
			let angle = ndx * ( 2 * Math.PI / elements[i].length );
			let angleOffset = THREE.MathUtils.degToRad(ringData.rotation+7);
			pos.set(
					( ringData.radius + offset ) * Math.cos( angle+angleOffset )*wheelGrp.scale.x,
					( ringData.radius + offset ) * Math.sin( angle+angleOffset )*wheelGrp.scale.y,
					0
				);
			e.position.copy(pos);
			translateLetter(e.userData.follower, pos, 0.25, "power1.inOut", 0, 0);

			if(appData.USE_LABELS){
				pos.set(pos.x+ringData.lbl_offset.x, pos.y+ringData.lbl_offset.y, pos.z+ringData.lbl_offset.z);
				labels_list[i][ndx].position.copy(pos);
			}
			
			e.material.color.copy(colors[i]).lerpHSL(new THREE.Color("#FFF"), (ndx * 0.007));
		  e.lookAt( 0, 0, 0 );
		  
		});
	}
	
}

//SET UP INTERACTIONS
// Set up camera and render loop
camera.position.z = 40;
camera.aspect = aspectRatio; // Update the camera's aspect ratio
camera.updateProjectionMatrix(); // Update the camera's projection matrix

function incrementRotation(direction=1){
	let step = 360/26;
	ringData.rotation+=step*direction;
	arrangeElements();
}

function addSelectedObject( object ) {
	selectedObjects = [];
	//selectedObjects.push( object );
	cipher.permute(object, elements, labels_list);
	incrementRotation();
}

// Function to handle mouse click events
function onMouseUp(event) {
  // Calculate mouse position in normalized device coordinates (NDC)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting with the ray
  const intersectsBtn = raycaster.intersectObjects(btns);
  const intersectsCtrl = raycaster.intersectObjects(ctrls);

  if (intersectsBtn.length > 0 ) {

   let clicked = intersectsBtn[0].object;
   addSelectedObject(clicked);
   
   if(appData.DEBUG){
   	postprocess.outlineObjects(selectedObjects);
   }

  }

  if (intersectsCtrl.length > 0 ) {
  	let clicked = intersectsCtrl[0].object;

  	if(clicked.userData.tag=='ZENITH'){
	   	incrementRotation();
	   }else if(clicked.userData.tag=='NADIR'){
	   	incrementRotation(-1);
	   }
	 }
}

window.addEventListener('mouseup', onMouseUp, false);

function onUpdateAppCtrls(){
	buildRings();
	arrangeElements();
}

function onUpdateCipherCtrls(){
	buildRings();
	arrangeElements();
}

function onFontLoad(font){
	FONT = font;
	console.log('Font Loaded')
	buildRings();
	postprocess.updateOutline();
	arrangeElements();
}

function animate() {

	requestAnimationFrame( animate );

	const timer = performance.now();

	renderer.render(scene, camera);

	if(appData.DEBUG){
		postprocess.composerRender();
	}	
}

animate();