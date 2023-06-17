<script setup>
import { computed } from 'vue';
import useTimeline from '@/composables/useTimeline';

const { isPlaying, startFrame, endFrame, currentFrame, framesPerSecond } = useTimeline();

const numberOfBars = computed(() => {
	return endFrame.value - startFrame.value + 4;
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
			<div class="bars">
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
				>
					<span class="hover">{{ index }}</span>
				</span>
			</div>
		</div>
	</div>
</template>

<style>
.TimelineControl {
	background-color: #333;
	padding: 8px;
	border-top: 1px solid #444;
}
.TimelineControl label {
	display: inline-block;
}
.TimelineControl label span {
	padding: 0 2px;
	font-size: 8px;
}
.TimelineControl label input {
	padding: 0 2px;
	width: 48px;
	height: 24px;
}
.TimelineControl .bars {
	height: 32px;
	background-color: #222;
}
.TimelineControl .bars .bar {
	display: inline-block;
	height: 100%;
	background-color: #282828;
	border-right: 1px solid #333;
	position: relative;
	overflow: visible;
}
.TimelineControl .bars .bar .hover {
	display: none;
}
.TimelineControl .bars .bar:hover .hover {
	display: block;
	position: absolute;
	top: 0;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 4px;
	padding: 4px;
	width: 32px;
	height: 16px;
}
.TimelineControl .bars .bar.darker {
	background-color: #222;
}
.TimelineControl .bars .bar.active {
	background-color: #04a7ff;
}
</style>
