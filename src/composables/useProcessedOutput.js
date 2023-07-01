import { ref } from 'vue';
import useScene from '@/composables/useScene';
const { processOutputColors } = useScene();

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
	const lines = makeSegments(byteStrings, 16).map((bytes) => `	${bytes.join(', ')}`);
	return `#ifndef ${NAME}_H
#define ${NAME}_H
static const uint8_t ${name}[] = {
${lines.join(',\n')}
};

#endif /* ${NAME}_H */
`;
};

let previousUrl;
const prepareDownload = (rawData, name) => {
	let data = rawData;
	let type = 'octet/stream';
	if (typeof data === 'string') {
		data = [data];
		type = 'text/plain';
	}
	const blob = new Blob(data, { type });
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

export default () => {
	return {
		outputName,
		processedDownloadLink,
		processOutput: () => {
			const dataArray = processOutputColors();
			const cHeaderText = formatOutputAsCHeader(dataArray);
			processedDownloadLink.value = prepareDownload(cHeaderText, outputName.value + '.h');
		},
	};
};
