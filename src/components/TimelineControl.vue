<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import useTimeline from '@/composables/useTimeline';

const { isPlaying, startFrame, endFrame, currentFrame, framesPerSecond } = useTimeline();

const numberOfBars = computed(() => {
	return endFrame.value - startFrame.value + 7;
});
const isMouseDown = ref(false);
const setCurrentFrame = (frameIndex) => {
	currentFrame.value = frameIndex;
};
const setCurrentFrameOnMouseOver = (frameIndex) => {
	if (isMouseDown.value) {
		setCurrentFrame(frameIndex);
	}
};
const mouseupOutsideTimelineHandler = () => {
	isMouseDown.value = false;
};
document.body.addEventListener('mouseup', mouseupOutsideTimelineHandler);
onBeforeUnmount(() => {
	document.body.removeEventListener('mouseup', mouseupOutsideTimelineHandler);
});
</script>

<template>
	<div class="TimelineControl">
		<form @submit.prevent="">
			<div>
				<label>
					<span>play</span>
					<input
						type="checkbox"
						v-model="isPlaying"
					/>
				</label>
				<label>
					<span title="The beginning of all time">start</span>
					<input
						type="number"
						v-model="startFrame"
					/>
				</label>
				<label>
					<span title="The end of the world">end</span>
					<input
						type="number"
						v-model="endFrame"
					/>
				</label>
				<label>
					<span title="The frame which is currently displayed">frame</span>
					<input
						type="number"
						v-model="currentFrame"
					/>
				</label>
				<label>
					<span title="Frames Per Second">fps</span>
					<input
						type="number"
						v-model="framesPerSecond"
					/>
				</label>
			</div>
		</form>
		<div class="timeline">
			<div
				class="bars"
				@mousedown="isMouseDown = true"
				@mouseup="isMouseDown = false"
			>
				<span
					v-for="(_, index) in numberOfBars"
					class="bar"
					:key="index"
					:class="{
						darker: index - 2 > endFrame || index - 2 < startFrame,
						active: index - 2 === currentFrame,
					}"
					:style="{
						width: 100 / numberOfBars + '%',
					}"
					@mousedown="setCurrentFrame(index - 2)"
					@mousemove="setCurrentFrameOnMouseOver(index - 2)"
				>
					<span class="hover">{{ index - 2 }}</span>
				</span>
			</div>
		</div>
	</div>
</template>

<style>
.TimelineControl {
	background-color: #333;
	border-top: 1px solid #444;
}
.TimelineControl label {
	position: relative;
	display: inline-block;
}
.TimelineControl label span {
	position: absolute;
	top: 4px;
	padding: 4px 4px 4px 0;
	font-size: 10px;
	line-height: 1rem;
	width: 2.5rem;
	text-align: right;
	border-right: 1px solid #666;
	background-color: #444;
}
.TimelineControl label input {
	padding: 0 2px 0 2.5rem;
	width: 96px;
	height: 24px;
}
.TimelineControl .bars {
	height: 32px;
	background-color: #222;
	border-top: 1px solid #222;
}
.TimelineControl .bars .bar {
	display: inline-block;
	height: 100%;
	background-color: #282828;
	border-right: 1px solid #333;
	position: relative;
	overflow: visible;
	user-select: none;
}
.TimelineControl .bars .bar .hover {
	display: none;
	position: absolute;
	top: -16px;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 4px;
	padding: 3px;
	font-size: 10px;
	line-height: 10px;
	pointer-events: none;
}
.TimelineControl .bars .bar.active .hover,
.TimelineControl .bars .bar:hover .hover {
	display: block;
}
.TimelineControl .bars .bar.darker {
	background-color: #222;
}
.TimelineControl .bars .bar.active {
	background-color: #04a7ff;
}
</style>
