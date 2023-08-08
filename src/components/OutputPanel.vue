<script setup>
import useProcessedOutput from '@/composables/useProcessedOutput';
import AccordionPanel from '@/components/AccordionPanel.vue';

const { outputName, outputType, outputTypes, processedDownloadLink, processOutput } =
	useProcessedOutput();
</script>

<template>
	<AccordionPanel title="Output">
		<p>This section allows you to generate static output in several different formats.</p>
		<form @submit.prevent="processOutput">
			<div class="form-control">
				<label>
					<span>Output Variable Name Prefix</span>
					<input
						type="text"
						v-model="outputName"
					/>
				</label>
			</div>
			<div class="form-control">
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

<style></style>
