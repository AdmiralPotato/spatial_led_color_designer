import { ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';

const presets = [
	{
		label: 'Default',
		value: `
return [
  Math.cos(((position.x + position.y) * 1) + (time * tau)) * 0.5 + 0.5,
  0,
  Math.cos(((position.z + position.y) * 0.5) + (time * pi)) * 0.5 + 0.5
]`.trim(),
	},
	{
		label: 'Positional Rainbow',
		value: `
return [
  Math.cos(((position.z + position.x) * 1 ) + (time * pi)) * 0.5 + 0.5,
  Math.cos(((position.z + position.y) * 2) + (time * tau)) * 0.5 + 0.5,
  Math.cos(((position.x + position.y) * 0.5) + (time * 3 * pi)) * 0.5 + 0.5
]`.trim(),
	},
	{
		label: 'Index based gradient',
		value: `
let brightness = ((index / count) + time) % 1;
return [
  brightness,
  brightness,
  brightness
]`.trim(),
	},
];

const colorFunctionString = useLocalStorage('colorFunctionString', ref(presets[0].value));

let currentColorFunction = () => [1, 1, 1];
const processColorFunction = () => {
	const equationText = colorFunctionString.value;
	try {
		currentColorFunction = new Function(
			'config',
			`
			const {
				index,
				count,
				position,
				time
			} = config;
			pi = Math.PI;
			tau = Math.PI * 2;
			${equationText}
			`,
		);
		// invoke it once to make sure that if it explodes, I handle it
		currentColorFunction({
			index: 0,
			count: 1,
			position: {
				x: 0,
				y: 0,
				z: 0,
			},
			time: 0,
		});
	} catch (e) {
		currentColorFunction = null;
		console.error(e);
	}
};

processColorFunction();

export default () => {
	return {
		presets,
		colorFunctionString,
		processColorFunction,
		getColorFunction() {
			return currentColorFunction;
		},
	};
};
