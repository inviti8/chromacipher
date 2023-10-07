import * as THREE from 'three';
import { shuffle, containsObject } from '/js/utils';

function insertAndShift(arr, from, to) {
    let cutOut = arr.splice(from, 1) [0]; // cut the element at index 'from'
    arr.splice(to, 0, cutOut);            // insert it at index 'to'
}

export function createCiphers(count){
	let ciphers=[];
	for (let i = 0; i < count; i++) {
		  ciphers.push(shuffledText().join(' ').replace(/\s/g, ""));
	}

	return ciphers
}

export function shuffledText(){
	const alphabet = [...Array(26)].map((e,i)=>(i+10).toString(36));
	return shuffle(alphabet);
};

export function permute(object, arrs, labels=undefined){
	let selIdx = 0;
	let unselIdx = 0;
	arrs.forEach((array, i) => {
		if(containsObject(object, array)){
			selIdx = i;
		}else{
			unselIdx = i;
		}
	});

	let unselArr = arrs[unselIdx];
	let unselLabels = labels[unselIdx];
	let index = arrs[selIdx].indexOf(object);

	permuteSelected(index, arrs[selIdx]);
	permuteUnselected(index, arrs[unselIdx]);

	if(labels!=undefined){
		permuteSelected(index, labels[selIdx]);
		permuteUnselected(index, labels[unselIdx]);
	}
}

export function permuteSelected(index, arr){
	//console.log(arr[index])
	let from = index - 3;
	let to = from - 11;

	if(from<0){
		from=arr.length+from;
	}
	if(to<0){
		to=arr.length+to;
	}

	insertAndShift(arr, from, to);
};

export function permuteUnselected(index, arr){
	let from = index - 1;
	let to = from - 13;
	if(from<0){
		from=arr.length+from;
	}
	if(to<0){
		to=arr.length+to;
	}

	insertAndShift(arr, from, to);
};

