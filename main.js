import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as labels from './js/labels';
import * as ui from './js/ui';
import * as postprocess from './js/postprocess';
import * as cipher from './js/chaocipher';

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

const wheelGrp = new THREE.Group();
scene.add(wheelGrp);

let elements = [[],[]];
let labels_list = [[],[]];
let colors = [red, green];
let alphabet = [...Array(26)].map((e,i)=>(i+10).toString(36));
let permute_sel = alphabet.length/2;
let permute_unsel = permute_sel+2;
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

const debug_1 = "ZPAOEQYUJFIKGDXCHBRTMLNWSV"
const debug_2 = "ECZVWMBXKJQSNTHDIUPOALRGFY"
const debug_letters = [debug_1, debug_2]


const appData = {
  DEBUG: false,
};

//Rings
const ringData = {
	radius:3,
	offset:1,
	rotation:0,
	lbl_offset: {x: 3.7, y: -1.69, z: 0.5}
};

let zenith = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), new THREE.MeshBasicMaterial({
    color: 'white'
}));

let nadir = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), new THREE.MeshBasicMaterial({
    color: 'white'
}));

postprocess.init(scene, camera, renderer);

let outlineData = postprocess.getOutlineData();

//Set up ui
ui.bindAppCtrls(appData);
ui.bindWheelCtrl(ringData, arrangeElements);
ui.bindOutlineCtrl(outlineData, postprocess.updateOutline);

// Function to calculate the aspect ratio
function calculateAspectRatio() {
    return window.innerWidth / window.innerHeight;
}

function insertAndShift(arr, from, to) {
    let cutOut = arr.splice(from, 1) [0];
    arr.splice(to, 0, cutOut);
}

function addUserData(elem, tag, color, index, letter){
	elem.userData = {'tag': tag, 'color': color, 'index': index, 'letter': letter};
}

function styleToRGB(style){
	let result = style.replace('rgb(','');
	result = result.replace(')','').split(',');

	return result
}

//Create initial geometries for each color/ring
colors.forEach((c, cdx) => {
	for (let i = 0; i < elem_cnt; i++) {
		//var letter = alphabet[i];
		var letter = debug_letters[cdx][i];
		//initElement(c, cdx, i, letter+i.toString())
	  initElement(c, cdx, i, letter);
	}
});

//Method to set up initial geometry
function initElement(color, cdx, idx, letter) {
	var rgb = styleToRGB(color.getStyle());

	let sizeOffset = 0.1*cdx;
  let e = new THREE.Mesh(new THREE.CylinderGeometry(0.3+sizeOffset, 0.4+sizeOffset, 0.9, 4), new THREE.MeshBasicMaterial({
    color: color
  }));

  e.geometry.rotateX(Math.PI * 0.5);
  addUserData( e, 'BTN_MESH', colors[cdx], idx, letter );
  btns.push(e);
  wheelGrp.add(e);
  elements[cdx].push(e);
  var label = labels.makeTextSprite( " " + letter.toUpperCase() + " ", { fontsize: 16, backgroundColor: {r:parseFloat(rgb[0]), g:parseFloat(rgb[1]), b:parseFloat(rgb[2]), a:0}, borderColor: {r:100, g:100, b:100, a: 0} } );
  addUserData( label, 'LABEL', colors[cdx], idx, letter );
	wheelGrp.add( label );
	labels_list[cdx].push( label );
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
			pos.set(pos.x+ringData.lbl_offset.x, pos.y+ringData.lbl_offset.y, pos.z+ringData.lbl_offset.z);
			labels_list[i][ndx].position.copy(pos);
			e.material.color.copy(colors[i]).lerpHSL(new THREE.Color("#FFF"), (ndx * 0.007));
		  e.lookAt( 0, 0, 0 );
		  
		});
	}
	
}

postprocess.updateOutline();
arrangeElements();

//SET UP INTERACTIONS
// Set up camera and render loop
camera.position.z = 40;
camera.aspect = aspectRatio; // Update the camera's aspect ratio
camera.updateProjectionMatrix(); // Update the camera's projection matrix

function addSelectedObject( object ) {
	selectedObjects = [];
	//selectedObjects.push( object );
	cipher.permute(object, elements, labels_list);
	arrangeElements();
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

  if (intersectsBtn.length > 0 ) {

   let clicked = intersectsBtn[0].object;
   addSelectedObject(clicked);
   //console.log(clicked)
   console.log(clicked.userData.index)
   if(appData.DEBUG){
   	postprocess.outlineObjects(selectedObjects);
   }

  }
}

window.addEventListener('mouseup', onMouseUp, false);

function animate() {

	requestAnimationFrame( animate );

	const timer = performance.now();

	renderer.render(scene, camera);

	if(appData.DEBUG){
		postprocess.composerRender();
	}
	
}

animate();