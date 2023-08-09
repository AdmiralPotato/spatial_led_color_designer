<script setup>
import { computed, ref } from 'vue';
import useColorFunction from '@/composables/useColorFunction';
import AccordionPanel from '@/components/AccordionPanel.vue';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

const {
	presets,
	userPresets,
	colorFunctionString,
	removePresetByName,
	saveCurrentPattern,
	processColorFunction,
} = useColorFunction();

const extensions = [javascript(), oneDark];

const lastSelectedPattern = ref(null);
const currentPattern = computed({
	get() {
		return lastSelectedPattern.value || presets[0];
	},
	set(v) {
		lastSelectedPattern.value = v;
		colorFunctionString.value = v.value;
		processColorFunction();
	},
});
</script>

<template>
	<AccordionPanel title="Color Function">
		<p>
			Here is where you will write a JavaScript function body that will be run once per tick
			for each LED in your input mesh. This function must return an array of Numbers, where
			the expected value is a float range from 0 to 1. Values outside of this range will be
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
				<label style="display: inline">
					<span>Load pattern:</span>
					<select v-model="currentPattern">
						<optgroup label="Built-in">
							<option
								v-for="item in presets"
								:key="item.label"
								:value="item"
							>
								{{ item.label }}
							</option>
						</optgroup>
						<optgroup label="User patterns (localStorage)">
							<option
								v-for="item in userPresets"
								:key="item.label"
								:value="item"
							>
								{{ item.label }}
							</option>
						</optgroup>
					</select>
				</label>
				<button
					v-if="lastSelectedPattern && lastSelectedPattern.is_custom"
					type="button"
					@click="removePresetByName(lastSelectedPattern.label)"
				>
					Delete "{{ lastSelectedPattern.label }}"
				</button>
			</div>
			<div class="form-control">
				<label>
					<span>Vertex Color Function</span>
					<codemirror
						v-model="colorFunctionString"
						:extensions="extensions"
						:indent-with-tab="true"
						:tab-size="4"
					/>
				</label>
				<div style="text-align: right">
					<button
						class="save"
						type="button"
						@click="saveCurrentPattern"
					>
						Save Pattern
					</button>
					<input
						type="submit"
						value="Run Input"
					/>
				</div>
			</div>
		</form>
	</AccordionPanel>
</template>
