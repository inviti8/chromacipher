import {Pane} from 'tweakpane';
const pane = new Pane();

const wheelCtrls = pane.addFolder({
  title: 'Wheel',
  expanded: true,   // optional
});

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
	  min: 0,
  	  max: 30,
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