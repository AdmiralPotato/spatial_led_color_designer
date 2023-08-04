<script setup>
import useScene from '@/composables/useScene';
import defaultShape from './default_shape.js';
import { computed, ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import TimelineControl from '@/components/TimelineControl.vue';
import useTimeline from '@/composables/useTimeline';
import ColorFunctionControl from '@/components/ColorFunctionControl.vue';
import useProcessedOutput from '@/composables/useProcessedOutput';

const { processObjText } = useScene();
const { advanceFrame, previousFrame, isPlaying } = useTimeline();
const { outputName, outputType, outputTypes, processedDownloadLink, processOutput } =
	useProcessedOutput();

const verts = ref([]);
const lastUploadedObjText = useLocalStorage('lastUploadedObjText', ref(defaultShape));

const vertCount = computed(() => verts.value.length);

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
		<form @submit.prevent="processOutput">
			<div>
				<label>
					<span>Output object name (probably use snake case or camel case)</span>
					<input
						type="text"
						v-model="outputName"
					/>
				</label>
			</div>
			<div>
				<label>
					<span>Output type</span>
					<select v-model="outputType">
						<option
							v-for="item in outputTypes"
							:key="item"
						>
							{{ item }}
						</option>
					</select>
				</label>
			</div>
			<div>
				<input
					type="submit"
					value="Process Output"
				/>
			</div>
		</form>
		<p v-if="processedDownloadLink">
			<a v-bind="processedDownloadLink"
				>Download <code>{{ processedDownloadLink.download }}</code></a
			>
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
