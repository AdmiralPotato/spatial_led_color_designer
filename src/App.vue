<script setup>
import useScene from '@/composables/useScene';
import { onMounted, ref } from 'vue';
import TimelineControl from '@/components/TimelineControl.vue';
import useTimeline from '@/composables/useTimeline';
import ColorFunctionPanel from '@/components/ColorFunctionPanel.vue';
import OutputPanel from '@/components/OutputPanel.vue';
import MeshInputPanel from '@/components/MeshInputPanel.vue';

// even if no other components are mounted to do this work,
// I want to be sure it's used to start the scene party
const { deselectAllVerts, vertCount, viewportDomParent } = useScene();

const { advanceFrame, previousFrame, isPlaying } = useTimeline();

const viewportHolder = ref(null);

const showControls = ref(true);

const keyHandlerMap = {
	'`': () => {
		showControls.value = !showControls.value;
	},
	' ': () => {
		isPlaying.value = !isPlaying.value;
	},
	'ctrl-d': deselectAllVerts,
	'meta-d': deselectAllVerts,
	ArrowRight: () => {
		isPlaying.value = false;
		advanceFrame();
	},
	ArrowLeft: () => {
		isPlaying.value = false;
		previousFrame();
	},
};

const inputSelectors = ['input', 'textarea', 'select', '.cm-editor *'];
window.addEventListener('keydown', (event) => {
	// console.log('What is keydown event?', event);
	let combination = [event.key];
	if (event.ctrlKey) {
		combination.unshift('ctrl');
	}
	if (event.altKey) {
		combination.unshift('alt');
	}
	if (event.shiftKey) {
		combination.unshift('shift');
	}
	if (event.metaKey) {
		combination.unshift('meta');
	}
	const handler = keyHandlerMap[combination.join('-')];
	if (
		handler &&
		// don't use these when an input is focused
		!event.target.matches(inputSelectors)
	) {
		event.preventDefault();
		handler();
	}
});
onMounted(() => {
	viewportHolder.value.appendChild(viewportDomParent);
});
</script>

<template>
	<div id="container">
		<div id="preview">
			<div id="viewport">
				<div
					id="viewport-holder"
					ref="viewportHolder"
				></div>
				<div id="vert-count">vertCount: {{ vertCount }}</div>
				<div class="bottom-panel">
					<div class="panel-toggler">
						<button @click="showControls = !showControls">Toggle Controls</button>
					</div>
				</div>
			</div>
			<TimelineControl />
		</div>
		<div
			id="controls"
			v-if="showControls"
		>
			<MeshInputPanel />
			<OutputPanel />
			<ColorFunctionPanel />
		</div>
	</div>
</template>
<style>
#container {
	display: flex;
	height: 100%;
}
#preview {
	position: relative;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	height: 100%;
	max-height: 100%;
}
#viewport {
	flex-grow: 1;
	position: relative;
}
#viewport-holder {
	height: 100%;
}
#vert-count {
	position: absolute;
	z-index: 0;
}
.bottom-panel {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
}
#controls {
	width: 50%;
	min-width: 320px;
	z-index: 1;
	top: 0;
	left: 0;
	background-color: #333;
	border-left: 1px solid #444;
	overflow-y: auto;
	max-height: 100%;
}
</style>
