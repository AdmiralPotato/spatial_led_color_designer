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
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import useTimeline from '@/composables/useTimeline';
import useColorFunction from '@/composables/useColorFunction';
import { computed, ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import defaultShape from '@/default_shape';

const { endFrame, startFrame, currentFrame } = useTimeline();
const { getColorFunction } = useColorFunction();

const renderer = new WebGLRenderer({
	alpha: true,
	antialias: true,
});
const labelRenderer = new CSS2DRenderer();
labelRenderer.domElement.className = 'label-div';
const canvas = renderer.domElement;
const viewportDomParent = document.createElement('div');
viewportDomParent.className = 'viewport-parent';
viewportDomParent.appendChild(canvas);
viewportDomParent.appendChild(labelRenderer.domElement);
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
const controls = new OrbitControls(camera, viewportDomParent);
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
		labelRenderer.setSize(clientWidth, clientHeight);
		center.set(width / 2, height / 2);
	}
};

let geometryBase = new SphereGeometry(1, 4, 2);
let geometry = geometryBase.clone();
let material = new MeshBasicMaterial({ color: 0xffff00 });
const sphere = new Mesh(geometry, material);
sphere.position.set(1, 0, 0);
const group = new Group();
scene.add(group);
group.add(sphere);

let go = true;
const loop = () => {
	const totalDuration = endFrame.value - startFrame.value + 1;
	const animationProgress = (startFrame.value + currentFrame.value / totalDuration) % 1;
	if (go) {
		requestAnimationFrame(loop);
		resize();
		controls.update();
		const vertexColorFunction = getColorFunction();
		if (vertexColorFunction) {
			const count = group.children.length;
			group.children.forEach((mesh, index) => {
				mesh.material.color.fromArray(
					vertexColorFunction({
						index,
						count,
						position: mesh.position,
						time: animationProgress,
					}),
				);
			});
		}
		renderer.render(scene, camera);
		labelRenderer.render(scene, camera);
	}
};
requestAnimationFrame(loop);

const processObjText = (text) => {
	// ...is this really the best way to empty the group?
	group.children = [];
	const verts = [];
	const lines = text.replace(/\r/g, '').split('\n');
	lines.forEach((line) => {
		const segments = line.split(' ');
		if (segments[0] === 'v') {
			const vert = [segments[1] * 1, segments[2] * 1, segments[3] * 1];
			const vertIndex = verts.length;
			verts.push(vert);
			// a unique material per object because that's the easiest way for each shape to have its own color
			material = new MeshBasicMaterial({ color: 0xffff00 });
			const sphere = new Mesh(geometry, material);
			const labelBox = document.createElement('div');
			const labelText = document.createElement('div');
			labelBox.className = 'vertex-label';
			labelText.className = 'vertex-label-text';
			labelText.innerText = '' + vertIndex;
			labelBox.appendChild(labelText);
			const label = new CSS2DObject(labelBox);
			sphere.position.set(vert[0], vert[1], vert[2]);
			sphere.add(label);
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
	geometry.copy(geometryBase);
	geometry.scale(vertScale, vertScale, vertScale);
	group.scale.set(scale, scale, scale);
	return verts;
};

// never go negative, never more than 255;
const clamp = (n) => (n >= 0 ? Math.min(255, n) : 0);
const processOutputColors = () => {
	const totalDuration = endFrame.value - startFrame.value + 1;
	const vertexColorFunction = getColorFunction();
	const result = [];
	for (let currentFrame = 0; currentFrame < totalDuration; currentFrame++) {
		const animationProgress = (startFrame.value + currentFrame / totalDuration) % 1;
		if (vertexColorFunction) {
			const count = group.children.length;
			group.children.forEach((mesh, index) => {
				result.push(
					...vertexColorFunction({
						index,
						count,
						position: mesh.position,
						time: animationProgress,
					}).map((n) => clamp(Math.round(n * 255))),
				);
			});
		}
	}
	return result;
};

const verts = ref([]);
const lastUploadedObjText = useLocalStorage('lastUploadedObjText', ref(defaultShape));
const settings = useLocalStorage('settings', { ledScale: 0.5, showIndices: false });
const ledSize = computed({
	get() {
		return settings.value.ledScale;
	},
	set(value) {
		const vertScale = value * 1;
		geometry.copy(geometryBase);
		geometry.scale(vertScale, vertScale, vertScale);
		settings.value.ledScale = vertScale;
	},
});
const showIndices = computed({
	get() {
		return settings.value.showIndices;
	},
	set(value) {
		const sanitized = !!value;
		const method = sanitized ? 'remove' : 'add';
		viewportDomParent.classList[method]('hidden');
		settings.value.showIndices = sanitized;
	},
});
// apply initial state after loading settings from localstorage
const method = showIndices.value ? 'remove' : 'add';
viewportDomParent.classList[method]('hidden');

const vertCount = computed(() => verts.value.length);

const ingestObjText = (text) => {
	lastUploadedObjText.value = text;
	verts.value = processObjText(text);
};

ingestObjText(lastUploadedObjText.value);

export default () => {
	return {
		processOutputColors,
		viewportDomParent,
		vertCount,
		ingestObjText,
		ledSize,
		showIndices,
	};
};
