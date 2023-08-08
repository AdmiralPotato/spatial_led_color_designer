<script setup>
import useColorFunction from '@/composables/useColorFunction';
import AccordionPanel from '@/components/AccordionPanel.vue';

const {
	presets,
	userPresets,
	colorFunctionString,
	removePresetByName,
	saveCurrentPattern,
	processColorFunction,
} = useColorFunction();
</script>

<template>
	<AccordionPanel title="Color Function">
		<p>
			Here is where you will write a JavaScript function that will be run once per tick for
			each LED in your input mesh. This function must return an array of Numbers, where the
			expected value is a float range from 0 to 1. Values outside of this range will be
			clamped to that range. There are several variables available for use inside this
			function:
		</p>
		<pre class="code">
position: {x:Number, y:Number, z:Number}
index: Number  // the index of the LED
count: Number  // total number of LEDs
time: Number   // A value in 0 to 1 range</pre
		>
		<form @submit.prevent="processColorFunction">
			<div class="form-control">
				<label>
					<span>Vertex Color Function</span>
					<textarea
						v-model="colorFunctionString"
						rows="7"
						cols="80"
					></textarea>
				</label>
			</div>
			<div>
				<button
					class="preset-button"
					v-for="item in presets"
					:key="item.label"
					type="button"
					@click="
						colorFunctionString = item.value;
						processColorFunction();
					"
				>
					{{ item.label }}
				</button>
				<button
					class="save"
					type="button"
					@click="saveCurrentPattern"
				>
					Save current pattern
				</button>
				<input
					type="submit"
					value="Process Color Function"
				/>
			</div>
			<div v-if="userPresets.length">
				<h3>User patterns (localStorage)</h3>
				<div>
					<span
						v-for="item in userPresets"
						:key="item.label"
					>
						<button
							class="preset-button"
							type="button"
							@click="
								colorFunctionString = item.value;
								processColorFunction();
							"
						>
							{{ item.label }}
						</button>
						<button
							class="delete-button"
							type="button"
							@click="removePresetByName(item.label)"
							:title="'Delete the pattern: ' + item.label"
						>
							x
						</button>
					</span>
				</div>
			</div>
		</form>
	</AccordionPanel>
</template>

<style scoped></style>
