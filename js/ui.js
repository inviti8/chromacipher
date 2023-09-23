import {Pane} from 'tweakpane';
const pane = new Pane();

const wheelCtrls = pane.addFolder({
  title: 'Wheel',
  expanded: true,   // optional
});

const outlineCtrls = pane.addFolder({
  title: 'outline',
  expanded: true,   // optional
});

export function bindAppCtrls(params){
	pane.addBinding(params, 'DEBUG');
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