<script setup>
import useScene from '@/composables/useScene';
import AccordionPanel from '@/components/AccordionPanel.vue';
import { computed } from 'vue';
import DownloadLink from '@/components/DownloadLink.vue';

const {
	regenerateObj,
	currentObjDownloadLink,
	deselectAllVerts,
	ingestObjText,
	ledSize,
	showIndices,
	reOrderIndices,
} = useScene();
const setFile = (event) => {
	const file = event.target.files[0];
	file.text().then(ingestObjText);
};

const ledScaleDisplay = computed(() => ledSize.value.toFixed(2));
</script>
<template>
	<AccordionPanel title="Mesh Input">
		<p>
			Here, you may input an <code>Wavefront/OBJ</code> 3D model file, where each vertex in
			your model will be treated as one RGB LED. This file is never sent to any server; all
			work is done locally in your browser.
		</p>
		<form @submit.prevent="">
			<div class="form-control">
				<label>
					<span>OBJ File</span>
					<input
						type="file"
						@input="setFile"
					/>
				</label>
			</div>
			<div class="form-control">
				<label>
					<span
						>LED preview size: <code>{{ ledScaleDisplay }}</code></span
					>
					<input
						type="range"
						v-model="ledSize"
						min="0.02"
						max="0.40"
						step="0.01"
						style="width: 100%"
					/>
				</label>
			</div>
			<div class="flex">
				<div class="form-control">
					<label>
						<span
							>Show Indices: <code>{{ showIndices }}</code></span
						>
						<input
							type="checkbox"
							:value="true"
							v-model="showIndices"
						/>
					</label>
				</div>
				<div class="form-control">
					<label>
						<span
							>Re-order Indices: <code>{{ reOrderIndices }}</code></span
						>
						<input
							type="checkbox"
							:value="true"
							v-model="reOrderIndices"
						/>
					</label>
				</div>
				<div class="form-control">
					<div>
						<button @click="deselectAllVerts">Deselect Verts</button>
					</div>
					<div>
						<button
							@click="regenerateObj"
							title="Regenerate OBJ from re-ordered vertices"
						>
							Regenerate OBJ
						</button>
					</div>
				</div>
			</div>
			<div>
				<DownloadLink :download="currentObjDownloadLink" />
			</div>
		</form>
	</AccordionPanel>
</template>
