import * as THREE from 'three';
import { gsap } from "gsap";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

const loader = new FontLoader();

export function animationConfig(anim='FADE', action='IN', duration=0.07, ease="power1.inOut", delay=0.007, onComplete=undefined){
  return {
    'anim': anim,
    'action': action,
    'duration': duration,
    'ease': ease,
    'delay': delay,
    'onComplete': onComplete
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

};

function translate(obj, pos, duration, ease, delay, delIdx=0){
	props = {duration: duration, x: pos.x, y: pos.y, z: pos.z, ease: ease };
	gsap.to(obj.position, props).delay(delay*delayIdx);
}

