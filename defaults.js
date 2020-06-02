//extension option storage
var prefs = {
	searchKey: {
		key: '.',
		ctrlKey: false,
		shiftKey: false,
		altKey: false
	},
	closeKey: {
		key: 'Escape',
		ctrlKey: false,
		shiftKey: false,
		altKey: false
	},
	focusKey: {
		key: 'Enter',
		ctrlKey: false,
		shiftKey: false,
		altKey: false
	},
	selectKey: {
		key: 'Enter',
		ctrlKey: false,
		shiftKey: true,
		altKey: false
	},
	clickKey: {
		key: 'Enter',
		ctrlKey: true,
		shiftKey: false,
		altKey: false
	},
	nextKey: {
		key: 'g',
		ctrlKey: true,
		shiftKey: false,
		altKey: false
	},
	previousKey: {
		key: 'G',
		ctrlKey: true,
		shiftKey: true,
		altKey: false
	},
	firstKey: {
		key: ',',
		ctrlKey: true,
		shiftKey: false,
		altKey: false
	},
	lastKey: {
		key: '.',
		ctrlKey: true,
		shiftKey: false,
		altKey: false
	},
	highlightOutline: '2px dashed #f22',
	selectOutline: '2px dashed #2f2',
	selectScroll: 'nearest',
	debugMatches: false
};

function loadPrefs(callback) {
	chrome.storage.local.get(prefs, callback);
}
