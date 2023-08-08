<script setup>
import useScene from '@/composables/useScene';
import AccordionPanel from '@/components/AccordionPanel.vue';

const { ingestObjText } = useScene();
const setFile = (event) => {
	const file = event.target.files[0];
	file.text().then(ingestObjText);
};
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
		</form>
	</AccordionPanel>
</template>
