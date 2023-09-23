import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

let composer, effectFXAA, outlinePass;

const outlineData = {
	edgeStrength: 5.0,
	edgeGlow: 0,
	edgeThickness: 0.01,
	pulsePeriod: 0
};

export function init(scene, camera, renderer){
	// postprocessing
	composer = new EffectComposer( renderer );

	const renderPass = new RenderPass( scene, camera );
	composer.addPass( renderPass );

	outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
	composer.addPass( outlinePass );

	const outputPass = new OutputPass();
	composer.addPass( outputPass );

	effectFXAA = new ShaderPass( FXAAShader );
	effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
	composer.addPass( effectFXAA );
};

export function getOutlineData(){
	return outlineData;
};

export function updateOutline(){
	outlinePass.visibleEdgeColor = '#ffffff';
	outlinePass.edgeStrength = outlineData.edgeStrength;
	outlinePass.edgeGlow = outlineData.edgeGlow;
	outlinePass.edgeThickness = outlineData.edgeThickness;
	outlinePass.pulsePeriod = outlineData.pulsePeriod;
};

export function outlineObjects(arr){
	outlinePass.selectedObjects = arr;
};

export function composerRender(){
	composer.render();
};