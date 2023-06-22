<script setup>
import useColorFunction from '@/composables/useColorFunction';

const { presets, colorFunctionString, processColorFunction } = useColorFunction();
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
			<input
				type="submit"
				value="Process Color Function"
			/>
		</div>
	</form>
</template>

<style scoped></style>
