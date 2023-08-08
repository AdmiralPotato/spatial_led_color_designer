<script setup>
import { useSettings } from '@/composables/useSettings';

const props = defineProps({
	title: {
		required: true,
		type: String,
	},
});

const { getPanelState } = useSettings();

const isOpen = getPanelState(props.title);
</script>
<template>
	<div
		class="AccordionPanel"
		:class="{
			open: isOpen,
		}"
	>
		<h3>
			<button @click="isOpen = !isOpen">{{ isOpen ? 'v' : '>' }} {{ title }}</button>
		</h3>
		<div
			class="content"
			v-if="isOpen"
		>
			<slot />
		</div>
	</div>
</template>
<style>
.AccordionPanel {
	border-top: 1px solid #444;
	border-bottom: 1px solid #444;
}

.AccordionPanel + .AccordionPanel {
	border-top: none;
}
.AccordionPanel > h3 {
	background-color: #222;
	line-height: 1.5em;
}
.AccordionPanel > h3 > * {
	vertical-align: middle;
}
.AccordionPanel > h3 > button {
	margin: 0 1rem 0 0;
	border: none;
	border-right: 1px solid #444;
}
.AccordionPanel.open h3 {
	border-bottom: 1px solid #444;
}
.AccordionPanel .content {
	padding: 8px;
}
</style>
