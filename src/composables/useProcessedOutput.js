import { ref } from 'vue';
import useScene from '@/composables/useScene';
import useTimeline from '@/composables/useTimeline';
import useColorFunction from '@/composables/useColorFunction';
const { processOutputColors } = useScene();
const { startFrame, endFrame, framesPerSecond } = useTimeline();
const { colorFunctionString } = useColorFunction();

const processedDownloadLink = ref(null);
const outputName = ref('');

const makeSegments = (array, n) => {
	let [...arr] = array;
	var res = [];
	while (arr.length) {
		res.push(arr.splice(0, n));
	}
	return res;
};
const formatOutputAsCHeader = (data) => {
	const name = outputName.value.replaceAll(' ', '_');
	const NAME = name.toLocaleUpperCase();
	const byteStrings = data.map((n) => '0x' + n.toString(16).padStart(2, '0').toLocaleUpperCase());
	const numFrames = endFrame.value - startFrame.value + 1;
	const numLights = data.length / 3 / numFrames;
	const lastLineIndex = numFrames * numLights - 1;
	const lines = makeSegments(byteStrings, 3).map((bytes, index) => {
		let trailingComma = ',';
		if (index === lastLineIndex) {
			trailingComma = '';
		}
		return `	${bytes.join(', ')}${trailingComma} // ${index % numLights}`;
	});
	const linesSegmentedByFrame = makeSegments(lines, numLights).map((lines, index) => {
		return `	// frame index ${index}\n${lines.join('\n')}`;
	});
	return `#ifndef ${NAME}_H
#define ${NAME}_H
/*
Generated from the following:
----
${colorFunctionString.value}
*/

static const uint32_t ${name}_led_count = ${numLights};
static const uint32_t ${name}_frame_size = ${numLights * 3};
static const uint32_t ${name}_frame_count = ${numFrames};
static const uint32_t ${name}_frame_rate = ${framesPerSecond.value};

static const uint8_t ${name}[] = {
${linesSegmentedByFrame.join('\n\n')}
};

#endif /* ${NAME}_H */
`;
};

const formatOutputAsBin = (data) => {
	return Uint8Array.from(data);
};

let previousUrl;
const prepareDownload = (rawData, name) => {
	let data = rawData;
	let type = 'octet/stream';
	if (typeof data === 'string') {
		type = 'text/plain';
	}
	const blob = new Blob([data], { type });
	const url = window.URL.createObjectURL(blob);
	if (previousUrl) {
		window.URL.revokeObjectURL(previousUrl);
	}
	return {
		href: url,
		target: '_blank',
		download: name,
	};
};

const outputTypeMap = {
	cHeader(dataArray) {
		const cHeaderText = formatOutputAsCHeader(dataArray);
		console.log('cHeaderText', cHeaderText);
		return {
			fileName: outputName.value + '.h',
			data: cHeaderText,
		};
	},
	bin(dataArray) {
		const data = formatOutputAsBin(dataArray);
		console.log('binData', data);
		return {
			fileName: outputName.value + '.bin',
			data,
		};
	},
};
let outputType = ref('cHeader');

export default () => {
	return {
		outputName,
		outputType,
		outputTypes: Object.keys(outputTypeMap),
		processedDownloadLink,
		processOutput: () => {
			const dataArray = processOutputColors();
			const { data, fileName } = outputTypeMap[outputType.value](dataArray);
			processedDownloadLink.value = prepareDownload(data, fileName);
		},
	};
};
