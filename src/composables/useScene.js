import {
	WebGLRenderer,
	PerspectiveCamera,
	Scene,
	DirectionalLight,
	HemisphereLight,
	// Fog,
	Vector3,
	Vector2,
	SphereGeometry,
	MeshBasicMaterial,
	Mesh,
	Group,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ref } from 'vue';

const canvas = document.getElementById('eyyyyy');
const renderer = new WebGLRenderer({
	canvas,
	alpha: true,
	antialias: true,
});
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
const controls = new OrbitControls(camera, renderer.domElement);
const scene = new Scene();

const directionalLight = new DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-2, 2, 2);
directionalLight.castShadow = true;
scene.add(directionalLight);

const light = new HemisphereLight(0xcefeff, 0xb3eaf0, 0.5);
scene.add(light);
// scene.fog = new Fog('#262626', 7, 9);

camera.position.set(8, 0, 0);
camera.lookAt(new Vector3(0, 0, 0));
camera.rotation.z = Math.PI;

let width;
let height;
let center = new Vector2();
const deg = Math.PI / 180;
const resize = () => {
	const clientWidth = canvas.clientWidth;
	const clientHeight = canvas.clientHeight;
	const dpr = window.devicePixelRatio;
	width = clientWidth * dpr;
	height = clientHeight * dpr;
	if (canvas.width !== width || canvas.height !== height) {
		const aspect = width / height;
		const desiredMinimumFov = Math.PI / 4; //90 deg
		// this ensures that I always have a 90deg square in the center of both landscape and portrait viewports
		camera.fov =
			(aspect >= 1
				? desiredMinimumFov
				: 2 * Math.atan(Math.tan(desiredMinimumFov / 2) / aspect)) / deg;
		camera.aspect = aspect;
		camera.updateProjectionMatrix();
		renderer.setPixelRatio(dpr);
		renderer.setSize(clientWidth, clientHeight, false);
		center.set(width / 2, height / 2);
	}
};

let geometry = new SphereGeometry(0.05, 4, 2);
let material = new MeshBasicMaterial({ color: 0xffff00 });
const sphere = new Mesh(geometry, material);
sphere.position.set(1, 0, 0);
const group = new Group();
scene.add(group);
group.add(sphere);

let vertProcessingFunction = null;
let go = true;
const loop = (time) => {
	if (go) {
		requestAnimationFrame(loop);
		resize();
		controls.update();
		if (vertProcessingFunction) {
			group.children.forEach((mesh) => {
				mesh.material.color.fromArray(
					vertProcessingFunction({
						position: mesh.position,
						time: time * 0.001,
					}),
				);
			});
		}
		renderer.render(scene, camera);
	}
};
requestAnimationFrame(loop);

const processObjText = (text) => {
	geometry = new SphereGeometry(1, 4, 2);
	// ...is this really the best way to empty the group?
	group.children = [];
	const verts = [];
	const lines = text.replace(/\r/g, '').split('\n');
	lines.forEach((line) => {
		const segments = line.split(' ');
		if (segments[0] === 'v') {
			const vert = [segments[1] * 1, segments[2] * 1, segments[3] * 1];
			verts.push(vert);
			// a unique material per object because that's the easiest way for each shape to have its own color
			material = new MeshBasicMaterial({ color: 0xffff00 });
			const sphere = new Mesh(geometry, material);
			sphere.position.set(vert[0], vert[1], vert[2]);
			group.add(sphere);
		}
	});
	const min = verts[0].slice();
	const max = verts[0].slice();
	verts.forEach((vert) => {
		min[0] = Math.min(min[0], vert[0]);
		min[1] = Math.min(min[1], vert[1]);
		min[2] = Math.min(min[2], vert[2]);
		max[0] = Math.max(max[0], vert[0]);
		max[1] = Math.max(max[1], vert[1]);
		max[2] = Math.max(max[2], vert[2]);
	});
	const scale =
		2 /
		Math.max(
			Math.abs(min[0]),
			Math.abs(min[1]),
			Math.abs(min[2]),
			Math.abs(max[0]),
			Math.abs(max[1]),
			Math.abs(max[2]),
		);
	const vertScale = 1 / scale / 20;
	geometry.scale(vertScale, vertScale, vertScale);
	group.scale.set(scale, scale, scale);
	return verts;
};

const processEquation = (equationText) => {
	try {
		vertProcessingFunction = new Function(
			'config',
			`
			const { position, time } = config
			${equationText}
			`,
		);
	} catch (e) {
		vertProcessingFunction = null;
		console.error(e);
	}
};

export default () => {
	return {
		processEquation,
		processObjText,
	};
};
