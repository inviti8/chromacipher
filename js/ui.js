import {Pane} from 'tweakpane';
const pane = new Pane();

const wheelCtrls = pane.addFolder({
  title: 'Wheel',
  expanded: false,   // optional
});

const outlineCtrls = pane.addFolder({
  title: 'outline',
  expanded: false,   // optional
});

const cipherCtrls = pane.addFolder({
  title: 'cipher text',
  expanded: false,   // optional
});

const encipherCtrls = pane.addFolder({
  title: 'encipher',
  expanded: false,   // optional
});

const decipherCtrls = pane.addFolder({
  title: 'decipher',
  expanded: false,   // optional
});

export function bindAppCtrls(params, callback){
	pane.addBinding(params, 'DEBUG');
	pane.addBinding(params, 'USE_LABELS').on('change', (ev) => {
		 callback();
	});
};

export function bindWheelCtrl(params, callback){

	const wheel_step = 360/26;

	wheelCtrls.addBinding(params, 'radius', {
	  step:1,
	  min: 0,
  	max: 30,
	}).on('change', (ev) => {
		 callback();
	});

	wheelCtrls.addBinding(params, 'offset', {
	  step:1,
	  min: -2,
  	max: 2,
	}).on('change', (ev) => {
		 callback();
	});

	wheelCtrls.addBinding(params, 'rotation', {
	  step:wheel_step,
	  min: -180,
  	max: 180,
	}).on('change', (ev) => {
		 callback();
	});

	wheelCtrls.addBinding(params, 'lbl_offset', {
	  step:0.01,
	}).on('change', (ev) => {
		 callback();
	});

};

export function bindOutlineCtrl(params, callback){

	for (const [key, value] of Object.entries(params)) {
  	outlineCtrls.addBinding(params, key, {
		  step:0.01,
		  min: 0,
	  	max: 10,
		}).on('change', (ev) => {
			 callback();
		});
	}

};

export function bindCipherCtrl(params, callback){
	cipherCtrls.addBinding(params, 'ring1');
	cipherCtrls.addBinding(params, 'ring2');

	const btnRandomizeText = cipherCtrls.addButton({
	  title: 'randomize text'
	});


	encipherCtrls.addBinding(params, 'text_in', {
	  readonly: false,
	  multiline: true,
	  rows: 3,
	});

	encipherCtrls.addBinding(params, 'text_out', {
	  readonly: true,
	  multiline: true,
	  rows: 3,
	});

	encipherCtrls.addBlade({
		 view: 'separator',
	});

	const btnEncipher = encipherCtrls.addButton({
	  title: 'encipher'
	});
	const btnCopy1 = encipherCtrls.addButton({
	  title: 'copy'
	});

	decipherCtrls.addBinding(params, 'text_in', {
	  readonly: false,
	  multiline: true,
	  rows: 3,
	});

	encipherCtrls.addBlade({
		 view: 'separator',
	});

	const btnDecipher = decipherCtrls.addButton({
	  title: 'decipher'
	});
	const btnCopy2 = decipherCtrls.addButton({
	  title: 'copy'
	});
};