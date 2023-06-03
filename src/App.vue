<script setup>
import useScene from '@/composables/useScene';
import defaultShape from './default_shape.js';
import { computed, ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';

const { processEquation, processObjText } = useScene();

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
		<form
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
	</div>
</template>
