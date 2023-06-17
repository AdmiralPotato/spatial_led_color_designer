import { ref, watchEffect } from 'vue';

const isPlaying = ref(true);
const startFrame = ref(1);
const endFrame = ref(48);
const currentFrame = ref(1);
const framesPerSecond = ref(24);
const advanceFrame = () => {
	currentFrame.value += 1;
	if (currentFrame.value > endFrame.value) {
		currentFrame.value = startFrame.value;
	}
};
const previousFrame = () => {
	currentFrame.value -= 1;
	if (currentFrame.value < startFrame.value) {
		currentFrame.value = endFrame.value;
	}
};
const tickFunction = () => {
	advanceFrame();
};
let interval = null;
watchEffect(() => {
	const playing = isPlaying.value;
	const fps = framesPerSecond.value;
	if (interval) {
		clearInterval(interval);
	}
	if (playing) {
		interval = setInterval(tickFunction, 1000 / fps);
	}
});

export default () => {
	return {
		advanceFrame,
		previousFrame,
		isPlaying,
		startFrame,
		endFrame,
		currentFrame,
		framesPerSecond,
	};
};
