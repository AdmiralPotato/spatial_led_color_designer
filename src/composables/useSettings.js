import { useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';

const panelStates = useLocalStorage('panelStates', {});

const getPanelState = (name) => {
	if (panelStates.value[name] === undefined) {
		panelStates.value[name] = true;
	}
	return computed({
		get: () => panelStates.value[name],
		set: (v) => (panelStates.value[name] = v),
	});
};

window.panelStates = panelStates;
export const useSettings = () => {
	return {
		getPanelState,
	};
};
