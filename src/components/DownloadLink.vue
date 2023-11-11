<script setup>
defineProps({
	download: Object,
});
</script>
<template>
	<p v-if="download">
		<a v-bind="download"
			>Download <code>{{ download.download }}</code></a
		>
	</p>
</template>
