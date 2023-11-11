let previousUrlPurposeMap = {};
export const prepareDownload = (rawData, purpose, fileName) => {
	let data = rawData;
	let type = 'octet/stream';
	if (typeof data === 'string') {
		type = 'text/plain';
	}
	const blob = new Blob([data], { type });
	const href = window.URL.createObjectURL(blob);
	if (previousUrlPurposeMap[purpose]) {
		window.URL.revokeObjectURL(previousUrlPurposeMap[purpose]);
		previousUrlPurposeMap[purpose] = href;
	}
	return {
		href,
		target: '_blank',
		download: fileName,
	};
};
