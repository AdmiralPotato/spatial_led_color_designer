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
		<form @submit.prevent="">
			<div>
				<input
					type="file"
					@input="setFile"
				/>
			</div>
		</form>
	</AccordionPanel>
</template>
