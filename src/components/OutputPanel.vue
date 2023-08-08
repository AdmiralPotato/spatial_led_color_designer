<script setup>
import useProcessedOutput from '@/composables/useProcessedOutput';
import AccordionPanel from '@/components/AccordionPanel.vue';

const { outputName, outputType, outputTypes, processedDownloadLink, processOutput } =
	useProcessedOutput();
</script>

<template>
	<AccordionPanel title="Output">
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
	</AccordionPanel>
</template>

<style scoped></style>
