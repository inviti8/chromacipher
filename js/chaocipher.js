import * as THREE from 'three';


function _shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function containsObject(obj, arr) {
    var i;
    for (i = 0; i < arr.length; i++) {
        if (arr[i] === obj) {
            return true;
        }
    }

    return false;
}

function insertAndShift(arr, from, to) {
    let cutOut = arr.splice(from, 1) [0]; // cut the element at index 'from'
    arr.splice(to, 0, cutOut);            // insert it at index 'to'
}

export function scrambleRing(arr){
	const alphabet = [...Array(26)].map((e,i)=>(i+10).toString(36));

	return _shuffle(alphabet);
};

export function permute(object, arrs, labels){
	let selIdx = 0;
	let unselIdx = 0;
	arrs.forEach((array, i) => {
		if(containsObject(object, array)){
			selIdx = i;
		}else{
			unselIdx = i;
		}
	});

	let selArr = arrs[selIdx];
	let selLabels = labels[selIdx];
	let unselArr = arrs[unselIdx];
	let unselLabels = labels[unselIdx];
	let index = selArr.indexOf(object);

	permuteSelected(index, arrs[selIdx]);
	permuteUnselected(index, arrs[unselIdx]);

	permuteSelected(index, labels[selIdx]);
	permuteUnselected(index, labels[unselIdx]);

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

	//console.log(from)
	console.log(arr[from])
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
	//console.log(arr[from])
	insertAndShift(arr, from, to);
};

