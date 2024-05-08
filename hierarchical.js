/* CMPSCI 373 Homework 5: Hierarchical Scene */

const width = 800, height = 600;
const fov = 25;
const cameraz = 0;
const aspect = width/height;
const smoothShading = true;
let   animation_speed = 1.0;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(fov, aspect, 1, 1000);
camera.position.set(-90, 45, cameraz);

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(width, height);
renderer.setClearColor(0x202020);
window.onload = function(e) {
	document.getElementById('window').appendChild(renderer.domElement);
}
let orbit = new THREE.OrbitControls(camera, renderer.domElement);	// create mouse control

let light0 = new THREE.DirectionalLight(0xFFFFFF, 1.0);
light0.position.set(camera.position.x, camera.position.y, camera.position.z);	// this light is at the camera
scene.add(light0);

let light1 = new THREE.DirectionalLight(0x800D0D, 1.0); // red light
light1.position.set(-1, 1, 0);
scene.add(light1);

let light2 = new THREE.DirectionalLight(0x0D0D80, 1.0); // blue light
light2.position.set(1, 1, 0);
scene.add(light2);

let amblight = new THREE.AmbientLight(0x202020);	// ambient light
scene.add(amblight);

const materials = [
	new THREE.MeshBasicMaterial({color: 0x3d3533}), // fur color
	new THREE.MeshBasicMaterial({color: 0xb6a7a0}), // skin color
	new THREE.MeshBasicMaterial({color: 0xc8c19a}), // horn color
	new THREE.MeshBasicMaterial({color: 0xffd359}), // beam color
	new THREE.MeshBasicMaterial({color: 0x211d1c}), // tail tip color
];
let material = new THREE.MeshPhongMaterial({color:0x808080, specular:0x101010, shininess: 50, side:THREE.FrontSide});
let models = []; // array that stores all models
let numModelsLoaded = 0;
let numModelsExpected = 0;
const getColor = (color) => materials[color];

const parts = ['head', 'upperBody', 'lowerBody', 'tailNoFur', 'tailFur',
				'leftForeArm', 'leftUpperArm', 'rightForeArm', 'rightUpperArm',
				'leftLeg', 'rightLeg'];

// The true center
// PX PY PZ RX RY RZ
const pose0 = [
	0, -6.3, 6.85, 147, 0, 0, // head
	0, -2.89, 5.77, 6.55, 0, 0, // upper body
	0, 0.11, 4.918, -18.6, 0, 0, // lower body
	-0.12, 3.37, 4.93, -13.3, 0, 0, // tail no fur
	-0.10, 6.06, 4.04, -21.9, 0, 0, // tail fur
	-3.38, -3.88, 1.72, -2.87, 1.44, 5.21, // left fore arm
	-2.57, -3.50, 4.90, 1.05, 37.8, -1.44, // left upper arm
	3.38, -3.88, 1.72, -2.87, 1.44, 5.21, // right fore arm
	2.36, -3.50, 4.90, -6.1, -30.7, 6.06, // right upper arm
	-1.29, 1.95, 1.70, 13.4, 0.09, -31, // left leg
	1.29, 1.95, 1.70, 13.4, -0.09, 31 // right leg
];

const pose1 = [
	-0.10, -4.8, 8.92, 165, 0, 0, // head
	0, -1.511, 7.41, -27, 0, 0, // upper body
	0, 0.71, 4.92, -43.9, 0, 0, // lower body
	-0.12, 3.37, 3.34, -56.1, 0, 0, // tali no fur
	0, 5.12, 1.27, -42.1, 0, 0, // tail fur
	-3.25, -2.13, 3.53, -1.62, -14.8, -5.39, // left fore arm
	-2.97, -1.39, 6.05, 1.05, 37.8, -1.44, // left upper arm
	3.22, -2.13, 3.53, -1.62, 14.8, 5.39, // right fore arm
	2.94, -1.39, 6.07, -6.1, -30.7, 6.06, // right upper arm
	-1.29, 1.95, 1.70, 13.4, 0.09, -31, // left leg
	1.29, 1.95, 1.70, 13.4, -0.09, 31 // right leg
];

const pose2 = [
	-0.07, 2.033, 12.07, 78.3, 0, 0, // head
	0.03, 1.58, 8.98, -107, 0, 0, // upper body
	0.03, 1.28, 6.09, -89.1, 0, 0, // lower body
	-0.12, 3.37, 4.93, -13.3, 0, 0, // tail no fur
	-0.07, 5.5, 4.27, -21.9, 0, 0, // tail fur
	-4.07, 2.13, 7.27, -6.01, 29.9, -6.02, // left fore arm
	-2.87, 2.18, 9.11, 1.05, 37.8, -1.44, // left upper arm
	4.07, 2.13, 7.27, -6.01, -29.9, 6.02, // right fore arm
	2.96, 2.18, 9.11, -6.1, -30.7, 6.06, // right upper arm
	-1.29, 1.95, 1.70, 13.4, 0.09, -31, // left leg
	1.29, 1.95, 1.70, 13.4, -0.09, 31 // right leg
];

const pose3 = [
	-0.07, -4.47, 8.42, 159, 0, 0, // head
	0.03, -1.4, 7.1, -25.6, 0, 0, // upper body
	0.03, 0.14, 5.30, -45.5, 0, 0, // lower body
	-0.12, 3.37, 3.34, -56.1, 0, 0, // tali no fur
	0, 5.12, 1.27, -42.1, 0, 0, // tail fur
	-4.20, -1.05, 3.94, -2.07, -10.1, -5.29, // left fore arm
	-2.98, -0.85, 6.91, 1.05, 37.8, -1.44, // left upper arm
	4.20, -1.05, 3.94, -2.07, 10.1, 5.29, // right fore arm
	3.01, -0.85, 6.91, -6.1, -30.7, 6.06, // right upper arm
	-1.29, 1.95, 1.70, 13.4, 0.09, -31, // left leg
	1.29, 1.95, 1.70, 13.4, -0.09, 31 // right leg
];

const pose4 = [
	-0.06, -5.82, 7.65, 119, 0, 0, // head
	0.043, -2.33, 6.46, 11, 0, 0, // upper body
	0.044, 0.63, 4.47, -34.9, 0, 0, // lower body

	-0.12, 3.37, 3.83, -13.3, 0, 0, // tail no fur
	-0.07, 5.5, 3.27, -21.9, 0, 0, // tail fur

	-4.06, -2.95, 1.43, -2.7, -3.31, -5.22, // left fore arm
	-3.11, -2.77, 4.77, 0.31, 54.9, -1.98, // left upper arm

	4.06, -2.95, 1.63, -2.7, 3.31, 5.22, // right fore arm
	3.11, -2.77, 4.77, 0.31, -54.9, 1.98, // right upper arm

	-1.28, 2.88, 1.7, 32.9, 11.4, -29, // left leg
	1.28, 2.88, 1.7, 32.9, -11.4, 29 // right leg
];

const pose5 = [
	-0.06, -5.82, 7.65, 119, 0, 0, // head
	0.043, -2.33, 6.46, 11, 0, 0, // upper body
	0.044, 0.63, 4.47, -34.9, 0, 0, // lower body

	-0.07, 3.37, 3.83, -13.3, 0, 0, // tali no fur
	-0.05, 5.48, 3.27, -21.9, 0, 0, // tail fur

	-4.06, -2.95, 1.63, -2.7, -3.31, -5.22, // left fore arm
	-3.11, -2.77, 4.77, 0.31, 54.9, -1.98, // left upper arm

	4.06, -2.95, 1.43, -2.7, 3.31, 5.22, // right fore arm
	3.11, -2.77, 4.77, 0.31, -54.9, 1.98, // right upper arm

	-1.28, 2.88, 1.7, 32.9, 11.4, -29, // left leg
	1.28, 2.88, 1.7, 32.9, -11.4, 29 // right leg
];

// load models
// ===YOUR CODE STARTS HERE===
function makeCube(width, height, thickness, x, y, z, color, xRotation, yRotation, zRotation) {
	function maker(width, height, thickness, x, y, z, color, xRotation, yRotation, zRotation) {
		const geo = new THREE.BoxGeometry(height*2, thickness*2, width*2, 1, 1, 1);
		let cube = new THREE.Mesh(geo, color);
		cube.position.set(0, 0, 0);
		let group = new THREE.Group();
		group.add(cube);
		group.position.set(y, z, x);
		group.rotation.x = xRotation;
		group.rotation.y = yRotation;
		group.rotation.z = zRotation;
		return group;
	}

	return maker(width, height, thickness, 
				x, y, z, 
				color, 
				xRotation*Math.PI/180, 
				yRotation*Math.PI/180, 
				zRotation*Math.PI/180);
}

function makeMesh(models, row) {
	const mesh = combined(models);
	new THREE.Box3().setFromObject(mesh).getCenter(mesh.position).multiplyScalar(-1);
	const pivot0 = new THREE.Group();
	pivot0.add(mesh);
	pivot0.position.x = pose0[row*6+1];
	pivot0.position.y = pose0[row*6+2];
	pivot0.position.z = pose0[row*6+0];

	return pivot0;
}

function combined(models) {
	const group = new THREE.Group();
	models.every(m => group.add(m));
	group.position.set(0, 0, 0);
	group.rotation.set(0, 0, 0);
	return group;
}	

function makeHead() {
	const face0 = makeCube(0.76, 0.54, 0.87, -0.066, -7.0, 5.95, getColor(1), 0, 0, 147);
	const face1 = makeCube(0.964, 0.778, 1.084, -0.066, -5.97, 6.47, getColor(0), 0, 0, -4.26);
	const face2 = makeCube(0.472, 0.276, 0.727, -0.065, -6.75, 4.74, getColor(1), 0.13, 0, 135);
	const face3 = makeCube(0.84, 0.59, 1.124, -0.066, -6.65, 5.95, getColor(1), 0, 0, 162);
	const face4 = makeCube(0.67, 1.05, 0.32, -0.065, -7.39, 5.39, getColor(1), 0, 0, 203);
	const leftHorn0 = makeCube(0.803, 0.198, 0.212, -4.53, -5.92, 7.78, getColor(2), -2.5, 0, -4.26);
	const leftHorn1 = makeCube(0.927, 0.261, 0.356, -3.27, -5.92, 7.34, getColor(2), 32.7, 0, -4.26);
	const leftHorn2 = makeCube(1.28, 0.39, 0.53, -1.64, -5.93, 6.73, getColor(2), 16.7, 0, -4.26);
	const rightHorn0 = makeCube(0.803, 0.198, 0.212, 4.53, -5.92, 7.78, getColor(2), 2.5, 180, -4.26);
	const rightHorn1 = makeCube(0.927, 0.261, 0.356, 3.27, -5.92, 7.34, getColor(2), -32.7, 180, -4.26);
	const rightHorn2 = makeCube(1.28, 0.39, 0.53, 1.64, -5.93, 6.73, getColor(2), -16.7, 180, -4.26);

	return makeMesh([face0, face1, face2, face3, face4, leftHorn0, leftHorn1, leftHorn2, rightHorn0, rightHorn1, rightHorn2], 0);
}

function makeBody() {
	const upperBody = makeCube(1.55, 1.54, 1.46, 0, -3.98, 6.82, getColor(0), 0, 0, 6.55);
	const upperBody1 = makeCube(1.89, 1.83, 1.3, 0, -2.48, 5.72, getColor(0), 0, 0, 6.55);
	const upperBody2 = makeCube(1.62, 1.82, 0.53, 0, -2.2, 4.78, getColor(1), 0, 0, -0.13);

	const lowerBody = makeCube(1.27, 1.79, 1, 0, 0.53, 5.2, getColor(0), 0, 0, -18.6);
	const lowerBody1 = makeCube(1.11, 1.82, 0.53, 0, -0.32, 4.64, getColor(1), 0, 0, -10.9);

	return [makeMesh([upperBody, upperBody1, upperBody2], 1), makeMesh([lowerBody, lowerBody1], 2)];
}

function makeTail() {
	const tailNoFur = makeCube(0.21, 1.38, 0.16, -0.11, 3.37, 4.93, getColor(0), 0, 0, -13.3);

	const tailFur = makeCube(0.21, 0.93, 0.16, -0.1, 5.4, 4.27, getColor(0), 0, 0, -21.9);
	const tailFur1 = makeCube(0.29, 0.7, 0.36, -0.09, 6.64, 3.81, getColor(4), 0, 0, -12.1);

	return [makeMesh([tailNoFur], 3), 
			makeMesh([tailFur, tailFur1], 4)];
}

function makeLeftArm() {
	const leftForeArm = makeCube(0.87, 0.64, 1.52, -3.3, -3.72, 2.58, getColor(0), 1.44, 5.21, -2.87);
	const leftForeArm1 = makeCube(0.86, 0.56, 0.94, -3.46, -4.05, 0.87, getColor(1), -0.28, -12.7, 15.4);

	const leftUpperArm = makeCube(1.2, 1.26, 1.73, -2.57, -3.5, 4.9, getColor(0), 37.8, -1.44, 1.05);
	
	return [makeMesh([leftForeArm, leftForeArm1], 5), 
			makeMesh([leftUpperArm], 6)];
}

function makeRightArm() {
	const rightForeArm = makeCube(0.87, 0.64, 1.52, 3.3, -3.72, 2.58, getColor(0), -1.44, 5.21, -2.87);
	const rightForeArm1 = makeCube(0.86, 0.56, 0.94, 3.46, -4.05, 0.87, getColor(1), 0.28, -12.7, 15.4);

	const rightUpperArm = makeCube(1.2, 1.26, 1.73, 2.57, -3.5, 4.9, getColor(0), -37.8, -1.44, 1.05);

	return [makeMesh([rightForeArm, rightForeArm1], 7), makeMesh([rightUpperArm], 8)];
}

function makeLeftLeg() {
	const leftLegMuscle0 = makeCube(0.64, 0.67, 1.09, -1.39, 1.72, 3.3, getColor(0), 0.09, -31, 13.4);
	const leftLegMuscle1 = makeCube(0.57, 0.69, 0.44, -1.28, 2.12, 2.17, getColor(0), 4.34, -23.7, -43.5);
	const leftLegMuscle2 = makeCube(0.39, 1.01, 0.34, -1.2, 2.3, 1.14, getColor(0), 0.553, -20.6, -89.4);
	const leftLegMuscle3 = makeCube(0.7, 0.25, 0.9, -1.3, 1.6, 0.19, getColor(1), -0.55, -16.7, -89.4);

	return makeMesh([leftLegMuscle0, leftLegMuscle1, leftLegMuscle2, leftLegMuscle3], 9);
}

function makeRightLeg() {
	const rightLegMuscle0 = makeCube(0.64, 0.67, 1.09, 1.38, 1.72, 3.3, getColor(0), -0.08, 31, 13.4);
	const rightLegMuscle1 = makeCube(0.57, 0.69, 0.44, 1.28, 2.12, 2.17, getColor(0), -4.34, 23.7, -43.5);
	const rightLegMuscle2 = makeCube(0.39, 1.01, 0.34, 1.11, 2.3, 1.14, getColor(0), 0.6, 20.6, -89.4);
	const rightLegMuscle3 = makeCube(0.7, 0.25, 0.9, 1.3, 1.6, 0.19, getColor(1), -0.6, 16.7, -89.4);
	
	return makeMesh([rightLegMuscle0, rightLegMuscle1, rightLegMuscle2, rightLegMuscle3], 10);
}

// Beam
const beamRate = 5;
const spinnginRate = 150;
let beamCounter = spinnginRate;

function resetBeam() {
	beamCounter = spinnginRate;
	scene.remove(models['block1']);
	models['head'].remove(models['block1']);
	models['beam'] = makeCube(0.5, 0.5, 1, 0, 0, 0, getColor(3), 0, 0, 0);
	models['block1'] = makeCube(1, 1, 1, 0, 0, 0, getColor(3), 0, -Math.PI/2, 0);
	models['block2'] = makeCube(0.4, 1.5, 1.5, 0, 0, 0, getColor(3), 0, 0, 0);

	models['block1'].add(models['beam']);
	models['beam'].add(models['block2']);
	scene.add(models['block1']);
	models['head'].add(models['block1']);
	models['block1'].position.set(-2, -2, 0);
	models['block1'].rotation.set(Math.PI/2, -Math.PI/3, 0);
}

function renderBeam() {
	if (beamCounter > 0) {
		if (beamCounter < spinnginRate*17/19) {
			models['block2'].visible = true;
		}

		const difference = spinnginRate / (beamRate * fps) * animation_speed;
		models['beam'].position.z += difference;
		models['beam'].scale.z += difference*2;

		models['block1'].rotation.z += Math.sin(difference);
		beamCounter -= difference;
		if (beamCounter < spinnginRate/2) {
			models['block1'].scale.x -= difference/100;
			models['block1'].scale.y -= difference/100;
		}
	} else {
		models['block1'].visible = false;
		models['block2'].visible = false;
	}
}

// animation methods
const actionTime = [0.4, 0.7, 0.3, 0.7, beamRate];
const fps = 60;
class StageCounter {
	#cnt = 0;
	get() {
		return this.#cnt;
	}
	inc() {
		this.#cnt++;
		if (this.#cnt > 4) {
			this.#cnt = 0;
		}
		if (this.#cnt === 0) {
			restoreToOriginalState();
		}
	}
}
const stage = new StageCounter();

function getTransitionValueTable(phase) {
	switch (phase) {
		case '01':
			return pose1.map((e, i) => e - pose0[i]);
		case '12':
			return pose2.map((e, i) => e - pose1[i]);
		case '23':
			return pose3.map((e, i) => e - pose2[i]);	
		case '34':
			return pose4.map((e, i) => e - pose3[i]);
		case '45':
			return pose5.map((e, i) => e - pose4[i]);			
	}
}

let phase01 = getTransitionValueTable('01');
let phase12 = getTransitionValueTable('12');
let phase23 = getTransitionValueTable('23');
let phase34 = getTransitionValueTable('34');
let phase45 = getTransitionValueTable('45');

function restoreToOriginalState() {
	parts.forEach(p => {
		models[p].position.x = pose0[parts.findIndex(name => name === p)*6+1];
		models[p].position.y = pose0[parts.findIndex(name => name === p)*6+2];
		models[p].position.z = pose0[parts.findIndex(name => name === p)*6+0];
		models[p].rotation.x = 0;
		models[p].rotation.y = 0;
		models[p].rotation.z = 0;
	})
}

function mover(isRotation, axis) {
	function addValue(modelName, value) {
		if (axis === 'x') {
			isRotation ? models[modelName].rotation.x += value : models[modelName].position.x += value;
		} else if (axis === 'y') {
			isRotation ? models[modelName].rotation.y += value : models[modelName].position.y += value;
		} else {
			isRotation ? models[modelName].rotation.z += value : models[modelName].position.z += value;
		}
	}

	// might cause bugs, remember to update this
	function additionalIndex() {
		if (!isRotation && axis === 'z') {
			return 0;
		} else if (!isRotation && axis === 'x') {
			return 1;
		} else if (!isRotation && axis === 'y') {
			return 2;
		} else if (isRotation && axis === 'z') {
			return 3;
		} else if (isRotation && axis === 'y') {
			return 4;
		} else {
			return 5;
		}
	}

	return function c(modelName, change, table) {
		const stored = table[parts.findIndex(x => x === modelName)*6 + additionalIndex()];
		if (stored === 0) {
			return;
		}
		const value = change / (actionTime[stage.get()] * fps) * animation_speed;
		let applyVal = value;
		if (isRotation) {
			applyVal = applyVal / Math.PI * 180;
		}
		if (stored > 0 && stored - applyVal < 0) {
			table[parts.findIndex(x => x === modelName)*6 + additionalIndex()] = 0;
			addValue(modelName, value);
			
			return;
		} else if (stored < 0 && stored - applyVal > 0) {
			table[parts.findIndex(x => x === modelName)*6 + additionalIndex()] = 0;
			addValue(modelName, value);
			return;
		}
		
		if (stored > 0 && applyVal < 0) {
			if (stored + applyVal < 0) {
				table[parts.findIndex(x => x === modelName)*6 + additionalIndex()] = 0;
			} else {
				table[parts.findIndex(x => x === modelName)*6 + additionalIndex()] += applyVal;
			}
		} else if (stored < 0 && applyVal > 0) {
			if (stored + applyVal > 0) {
				table[parts.findIndex(x => x === modelName)*6 + additionalIndex()] = 0;
			} else {
				table[parts.findIndex(x => x === modelName)*6 + additionalIndex()] += applyVal;
			}
		} else if (stored > 0 && applyVal > 0) {
			if (stored - applyVal < 0) {
				table[parts.findIndex(x => x === modelName)*6 + additionalIndex()] = 0;
			} else {
				table[parts.findIndex(x => x === modelName)*6 + additionalIndex()] -= applyVal;
			}
		} else {
			if (stored - applyVal > 0) {
				table[parts.findIndex(x => x === modelName)*6 + additionalIndex()] = 0;
			} else {
				table[parts.findIndex(x => x === modelName)*6 + additionalIndex()] -= applyVal;
			}
		}
		addValue(modelName, value);
	}
}

const rotationMoverX = mover(true, 'x');
const rotationMoverY = mover(true, 'y');
const rotationMoverZ = mover(true, 'z');
const positionMoverX = mover(false, 'x');
const positionMoverY = mover(false, 'y');
const positionMoverZ = mover(false, 'z');
const rotate = (modelName, change, table, axis) => {
	if (axis === 'x') {
		rotationMoverX(modelName, change*Math.PI/180, table);
	} else if (axis === 'y') {
		rotationMoverY(modelName, change*Math.PI/180, table);
	} else {
		rotationMoverZ(modelName, change*Math.PI/180, table);
	}
};

function action01() {
	if (stage.get() !== 0) {return;}
	const table = getTransitionValueTable('01');
	parts.forEach(p => {
		positionMoverZ(p, table[parts.findIndex(x => x === p)*6+0], phase01);
		positionMoverX(p, table[parts.findIndex(x => x === p)*6+1], phase01);
		positionMoverY(p, table[parts.findIndex(x => x === p)*6+2], phase01);
		rotate(p, table[parts.findIndex(x => x === p)*6+3], phase01, 'z');
		rotate(p, table[parts.findIndex(x => x === p)*6+4], phase01, 'y');
		rotate(p, table[parts.findIndex(x => x === p)*6+5], phase01, 'x');
	});
}

function action12() {
	if (stage.get() !== 1) {return;}
	const table = getTransitionValueTable('12');
	parts.forEach(p => {
		positionMoverZ(p, table[parts.findIndex(x => x === p)*6+0], phase12);
		positionMoverX(p, table[parts.findIndex(x => x === p)*6+1], phase12);
		positionMoverY(p, table[parts.findIndex(x => x === p)*6+2], phase12);
		rotate(p, table[parts.findIndex(x => x === p)*6+3], phase12, 'z');
		rotate(p, table[parts.findIndex(x => x === p)*6+4], phase12, 'y');
		rotate(p, table[parts.findIndex(x => x === p)*6+5], phase12, 'x');
	});
}

function action23() {
	if (stage.get() !== 2) {return;}
	const table = getTransitionValueTable('23');
	parts.forEach(p => {
		positionMoverZ(p, table[parts.findIndex(x => x === p)*6+0], phase23);
		positionMoverX(p, table[parts.findIndex(x => x === p)*6+1], phase23);
		positionMoverY(p, table[parts.findIndex(x => x === p)*6+2], phase23);
		rotate(p, table[parts.findIndex(x => x === p)*6+3], phase23, 'z');
		rotate(p, table[parts.findIndex(x => x === p)*6+4], phase23, 'y');
		rotate(p, table[parts.findIndex(x => x === p)*6+5], phase23, 'x');
	});
}

function action34() {
	if (stage.get() !== 3) {return;}
	const table = getTransitionValueTable('34');
	parts.forEach(p => {
		positionMoverZ(p, table[parts.findIndex(x => x === p)*6+0], phase34);
		positionMoverX(p, table[parts.findIndex(x => x === p)*6+1], phase34);
		positionMoverY(p, table[parts.findIndex(x => x === p)*6+2], phase34);
		rotate(p, table[parts.findIndex(x => x === p)*6+3], phase34, 'z');
		rotate(p, table[parts.findIndex(x => x === p)*6+4], phase34, 'y');
		rotate(p, table[parts.findIndex(x => x === p)*6+5], phase34, 'x');
	});
}

function action45() {
	if (stage.get() !== 4) {return;}
	const table = getTransitionValueTable('45');
	parts.forEach(p => {
		positionMoverZ(p, table[parts.findIndex(x => x === p)*6+0], phase45);
		positionMoverX(p, table[parts.findIndex(x => x === p)*6+1], phase45);
		positionMoverY(p, table[parts.findIndex(x => x === p)*6+2], phase45);
		rotate(p, table[parts.findIndex(x => x === p)*6+3], phase45, 'z');
		rotate(p, table[parts.findIndex(x => x === p)*6+4], phase45, 'y');
		rotate(p, table[parts.findIndex(x => x === p)*6+5], phase45, 'x');
	});
}

// ---YOUR CODE ENDS HERE---
//loadModel(bunny_model, material, 'sun');
//loadModel(bunny_model, material, 'earth');

// 'label' is a unique name for the model for accessing it later
function loadModel(objstring, material, label) {
	numModelsExpected++;
	loadOBJFromString(objstring, function(mesh) { // callback function for non-blocking load
		mesh.computeFaceNormals();
		if(smoothShading) mesh.computeVertexNormals();
		models[label] = new THREE.Mesh(mesh, material);
		numModelsLoaded++;
	}, function() {}, function() {});
}

let initialized = false;
function animate() {
	requestAnimationFrame( animate );
	if(numModelsLoaded == numModelsExpected) {	// all models have been loaded
		if(!initialized) {
			initialized = true;
			// construct the scene by adding models
// ===YOUR CODE STARTS HERE===
			models['head'] = makeHead();
			const body = makeBody();
			models['upperBody'] = body[0];
			models['lowerBody'] = body[1];
			const tail = makeTail();
			models['tailNoFur'] = tail[0];
			models['tailFur'] = tail[1];
			const leftArm = makeLeftArm();
			models['leftForeArm'] = leftArm[0];
			models['leftUpperArm'] = leftArm[1];
			const rightArm = makeRightArm();
			models['rightForeArm'] = rightArm[0];
			models['rightUpperArm'] = rightArm[1];
			models['leftLeg'] = makeLeftLeg();
			models['rightLeg'] = makeRightLeg();

			scene.add(models['head']);
			scene.add(models['upperBody']);
			scene.add(models['lowerBody']);
			scene.add(models['tailNoFur']);
			scene.add(models['tailFur']);
			scene.add(models['leftForeArm']);
			scene.add(models['leftUpperArm']);
			scene.add(models['rightForeArm']);
			scene.add(models['rightUpperArm']);
			scene.add(models['leftLeg']);
			scene.add(models['rightLeg']);

			let beam = makeCube(0.5, 0.5, 1, 0, 0, 0, getColor(3), 0, 0, 0);
			let block1 = makeCube(1, 1, 1, 0, 0, 0, getColor(3), 45, -90, 90);
			let block2 = makeCube(0.4, 1.5, 1.5, 0, 0, 0, getColor(3), 0, 0, 0);
			models['beam'] = beam;
			models['block1'] = block1;
			models['block2'] = block2;

			models['block1'].add(models['beam']);
			models['beam'].add(models['block2']);
			scene.add(models['block1']);
			models['head'].add(models['block1']);
			models['block1'].position.set(-2, -2, 0);
			models['block1'].rotation.set(Math.PI/2, -Math.PI/3, 0);

			models['block1'].visible = false;
			models['block2'].visible = false;
// ---YOUR CODE ENDS HERE---	
			//scene.add(models['sun']);
			//models['earth'].position.x=3;
			//scene.add(models['earth']);
		}
		// animate the scene
// ===YOUR CODE STARTS HERE===
		// decide what action should be taken
		switch(stage.get()) {
			case 0:
				if (phase01.every(n => n === 0)) {
					stage.inc();
					phase01 = getTransitionValueTable('01');
				} else {
					action01();
				}
				break;
			case 1:
				if (phase12.every(n => n === 0)) {
					stage.inc();
					phase12 = getTransitionValueTable('12');
				} else {
					action12();
				}
				break;
			case 2:
				if (phase23.every(n => n === 0)) {
					stage.inc();
					phase23 = getTransitionValueTable('23');
				} else {
					action23();
				}
				break;
			case 3:
				if (phase34.every(n => n === 0)) {
					stage.inc();
					phase34 = getTransitionValueTable('34');
				} else {
					models['block1'].visible = true;
					models['block2'].visible = false;
					renderBeam();
					action34();
				}
				break;
			case 4:
				if (phase45.every(n => n === 0)) {
					stage.inc();
					resetBeam();
					phase45 = getTransitionValueTable('45');
					models['block2'].visible = false;
					models['block1'].visible = false;
				} else {
					renderBeam();
					action45();
				}
				break;
		}
		scene.rotation.y += 0.01
// ---YOUR CODE ENDS HERE---
		//models['sun'].rotation.y+=0.01*animation_speed;
		//models['earth'].rotation.y+=0.05*animation_speed;
	}
	light0.position.set(camera.position.x, camera.position.y, camera.position.z); // light0 always follows camera position
	renderer.render(scene, camera);
}

animate();

function onKeyDown(event) {
	switch(event.key) {
		case 'w':
		case 'W':
			//material.wireframe = !material.wireframe;
			materials.forEach(m => m.wireframe = !m.wireframe);
			break;
		case '=':
		case '+':
			animation_speed += 0.05;
			document.getElementById('msg').innerHTML = 'animation_speed = '+animation_speed.toFixed(2);
			break;
		case '-':
		case '_':
			if(animation_speed>0) animation_speed-=0.05;
			document.getElementById('msg').innerHTML = 'animation_speed = '+animation_speed.toFixed(2);
			break;
		case 'r':
		case 'R':
			orbit.reset();
			break;
	}
}

window.addEventListener('keydown', onKeyDown, false); // as key control if you need
