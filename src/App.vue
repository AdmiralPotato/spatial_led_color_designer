<script setup>
import useScene from '@/composables/useScene';
import defaultShape from './default_shape.js';
import { computed, ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import TimelineControl from '@/components/TimelineControl.vue';
import useTimeline from '@/composables/useTimeline';

const { processEquation, processObjText } = useScene();
const { advanceFrame, previousFrame, isPlaying } = useTimeline();

const defaultEquationValue = `return [
  Math.cos(((position.z + position.y) * 1) + (time * 4)) * 0.5 + 0.5,
  0,
  Math.cos(((position.x + position.y) * 0.5) + (time * 2)) * 0.5 + 0.5
]`;

const verts = ref([]);
const lastUploadedObjText = useLocalStorage('lastUploadedObjText', ref(defaultShape));
const equation = useLocalStorage('equation', ref(defaultEquationValue));

const vertCount = computed(() => verts.value.length);

const ingestObjText = (text) => {
	lastUploadedObjText.value = text;
	verts.value = processObjText(text);
};
const submitEquation = () => {
	processEquation(equation.value);
};
const setFile = (event) => {
	const file = event.target.files[0];
	file.text().then(ingestObjText);
};

// add goat
ingestObjText(lastUploadedObjText.value);
submitEquation(equation.value);
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
		<div class="bottom-panel">
			<form
				v-if="showEquation"
				id="equations"
				@submit.prevent="submitEquation"
			>
				<div>
					<label>
						<span>Equation</span>
						<textarea
							v-model="equation"
							rows="10"
							cols="80"
						></textarea>
					</label>
				</div>
				<div>
					<input
						type="submit"
						value="Process Equation"
					/>
				</div>
			</form>
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
