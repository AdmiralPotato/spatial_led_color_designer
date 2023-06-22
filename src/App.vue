<script setup>
import useScene from '@/composables/useScene';
import defaultShape from './default_shape.js';
import { computed, ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import TimelineControl from '@/components/TimelineControl.vue';
import useTimeline from '@/composables/useTimeline';
import ColorFunctionControl from '@/components/ColorFunctionControl.vue';

const { processOutputColors, processObjText } = useScene();
const { advanceFrame, previousFrame, isPlaying } = useTimeline();

const verts = ref([]);
const lastUploadedObjText = useLocalStorage('lastUploadedObjText', ref(defaultShape));

const vertCount = computed(() => verts.value.length);
const processedOutput = ref([]);

const ingestObjText = (text) => {
	lastUploadedObjText.value = text;
	verts.value = processObjText(text);
};
const setFile = (event) => {
	const file = event.target.files[0];
	file.text().then(ingestObjText);
};

// add goat
ingestObjText(lastUploadedObjText.value);
const showEquation = ref(false);

const keyHandlerMap = {
	'`': () => {
		showEquation.value = !showEquation.value;
	},
	' ': () => {
		isPlaying.value = !isPlaying.value;
	},
	ArrowRight: () => {
		isPlaying.value = false;
		advanceFrame();
	},
	ArrowLeft: () => {
		isPlaying.value = false;
		previousFrame();
	},
};

const listOfInputLikeTags = ['INPUT', 'TEXTAREA', 'SELECT'];
window.addEventListener('keydown', (event) => {
	console.log(`What is key? "${event.key}"`);
	const handler = keyHandlerMap[event.key];
	if (
		handler &&
		// don't use these when an input is focused
		!listOfInputLikeTags.includes(event.target.tagName)
	) {
		event.preventDefault();
		handler();
	}
});
</script>

<template>
	<div id="controls">
		<div>vertCount: {{ vertCount }}</div>
		<form @submit.prevent="">
			<div>
				<input
					type="file"
					@input="setFile"
				/>
			</div>
		</form>
		<form @submit.prevent="processedOutput = processOutputColors()">
			<div>
				<input
					type="submit"
					value="Process Output"
				/>
			</div>
		</form>
		<p>
			Processed Output <code>{{ processedOutput }}</code>
		</p>
		<div class="bottom-panel">
			<ColorFunctionControl v-if="showEquation" />
			<TimelineControl />
		</div>
	</div>
</template>
<style>
.bottom-panel {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
}
</style>
