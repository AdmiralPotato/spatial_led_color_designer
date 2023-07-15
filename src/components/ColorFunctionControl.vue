<script setup>
import useColorFunction from '@/composables/useColorFunction';

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
	<form
		id="equations"
		@submit.prevent="processColorFunction"
	>
		<div>
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
</template>

<style scoped></style>
