<script>
import useScene from '@/composables/useScene';
import defaultShape from './default_shape.js';

const { submitEquation, processObjText } = useScene();

export default {
	data() {
		return {
			verts: [],
			file: null,
			equation: `return [
  Math.cos(((position.z + position.y) * 1) + (time * 4)) * 0.5 + 0.5,
  0,
  Math.cos(((position.x + position.y) * 0.5) + (time * 2)) * 0.5 + 0.5
]`,
		};
	},
	computed: {
		vertCount() {
			return this.verts.length;
		},
	},
	created() {
		// add goat
		this.processObjText(defaultShape);
		this.submitEquation();
	},
	methods: {
		setFile(event) {
			const file = event.target.files[0];
			file.text().then(this.processObjText);
		},
		processObjText(text) {
			this.verts = processObjText(text);
		},
		handleSubmit() {
			console.log(this.file);
		},
		submitEquation() {
			submitEquation(this.equation);
		},
	},
};
</script>

<template>
	<div id="controls">
		<div>vertCount: {{ vertCount }}</div>
		<form @submit.prevent="handleSubmit">
			<div>
				<input
					type="file"
					@input="setFile"
				/>
			</div>
			<div>
				<input type="submit" />
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
