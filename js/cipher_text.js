import * as THREE from 'three';
import { gsap } from "gsap";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { getSize } from '/js/utils';

const loader = new FontLoader();
let pos = new THREE.Vector3();

export function animationConfig(duration=0.07, ease="power1.inOut", delay=0.007, delayIdx=0, onComplete=undefined, onCompleteParams=undefined){
  return {
    'duration': duration,
    'ease': ease,
    'delay': delay,
    'delayIdx': delayIdx,
    'onComplete': onComplete,
    'onCompleteParams': onCompleteParams
  }
};

export function loadFont(fontPath, onFontLoaded){
	loader.load( fontPath, function ( font ) {
		onFontLoaded(font);
	} );
};

export function textGeometry(character, font, size, height, curveSegments=12, bevelEnabled=false, bevelThickness=0.1, bevelSize=1, bevelOffset=1, bevelSegments=3) {
  return new TextGeometry(character, {
		font: font,
		size: size,
		height: height,
		curveSegments: curveSegments,
		bevelEnabled: bevelEnabled,
		bevelThickness: bevelThickness,
		bevelSize: bevelSize,
		bevelOffset: bevelOffset,
		bevelSegments: bevelSegments,
	});
};

export function textMesh(character, font, size, height, curveSegments=10, bevelEnabled=false, bevelThickness=0.1, bevelSize=1, bevelOffset=1, bevelSegments=3){

	const geometry = textGeometry(character, font, size, height, curveSegments, bevelEnabled, bevelThickness, bevelSize, bevelOffset, bevelSegments);
	const mat = new THREE.MeshBasicMaterial( {color: 'white'} );
	const letterMesh = new THREE.Mesh(geometry, mat);

	return letterMesh
};

export function translateLetter(letter, targetPos, duration, ease, delay=0, delayIdx=0, onComplete=undefined, onCompleteParams=undefined){

	const config = animationConfig(duration, ease, delay, delayIdx, onComplete, onCompleteParams);
	const size = getSize( letter );
	const offsetX = size.width/2;
	const offsetY = size.height/2;
	console.log(offsetX)
	targetPos=pos.set( targetPos.x-offsetX, targetPos.y-offsetY, targetPos.z );
	translate(letter, targetPos, config);

};

function translate(obj, pos, config){

	const props = { duration: config.duration, x: pos.x, y: pos.y, z: pos.z, ease: config.ease };
	gsap.to(obj.position, props).delay(config.delay*config.delayIdx);

}

