function autoGrow(event) {
	event.target.style.height = 'auto';
	event.target.style.height = event.target.scrollHeight + 'px';
}
//save input val using its id as a name
function saveValue(event) {
	chrome.storage.local.set({ [event.target.id]: event.target.value });
}
function saveNumber(event) {
	chrome.storage.local.set({ [event.target.id]: Number(event.target.value) });
}
function saveChecked(event) {
	chrome.storage.local.set({ [event.target.id]: event.target.checked });
}
function saveKey(event) {
	chrome.storage.local.set({ [event.target.id]: {
			key: event.key,
			ctrlKey: event.ctrlKey,
			shiftKey: event.shiftKey,
			altKey: event.altKey
		}
	});
	keyUpdate(event);
}
function disableKey(event) {
	const input = event.target.previousElementSibling;
	chrome.storage.local.set({ [input.id]: {key: 'disabled'} });
	input.value = '';
}
//set text field value using shortcut key modifiers (modifier order doesn't matter)
function keyUpdate(event) {
	const modKeys = ['Control', 'Shift', 'Alt', 'OS', 'Meta'];
	const key = event.key;
	//clear text field
	event.target.value = '';

	if(key === 'disabled')
		return;
	if(event.ctrlKey)
		event.target.value += 'Ctrl+';
	if(event.shiftKey)
		event.target.value += 'Shift+';
	if(event.altKey)
		event.target.value += 'Alt+';
	//avoid adding modifier keys
	if(modKeys.indexOf(key) < 0)
		event.target.value += key;
}
function cancelReset(target) {
	target.textContent = 'Default options';
}
function factoryReset(event) {
	if(event.target.textContent === 'Confirm') {
		//clear storage and reload page
		chrome.storage.local.clear();
		window.location.reload();
	}
	event.target.textContent = 'Confirm';
	window.setTimeout(cancelReset, 2500, event.target);
}

function readPrefs(storage) {
	document.getElementById('highlightOutline').value = storage.highlightOutline;
	document.getElementById('selectOutline').value = storage.selectOutline;
	document.getElementById('selectScroll').value = storage.selectScroll;
	document.getElementById('debugMatches').checked = storage.debugMatches;

	keyUpdate({target: document.getElementById('searchKey'), ...storage.searchKey});
	keyUpdate({target: document.getElementById('closeKey'), ...storage.closeKey});
	keyUpdate({target: document.getElementById('focusKey'), ...storage.focusKey});
	keyUpdate({target: document.getElementById('selectKey'), ...storage.selectKey});
	keyUpdate({target: document.getElementById('clickKey'), ...storage.clickKey});
	keyUpdate({target: document.getElementById('nextKey'), ...storage.nextKey});
	keyUpdate({target: document.getElementById('previousKey'), ...storage.previousKey});
	keyUpdate({target: document.getElementById('firstKey'), ...storage.firstKey});
	keyUpdate({target: document.getElementById('lastKey'), ...storage.lastKey});
}
function getPrefs() {
	//events for disabling shortcuts
	const disable = document.body.getElementsByClassName('disableKey');
	for(let d = disable.length-1; d >= 0; d--) {
		disable[d].addEventListener('click', disableKey);
	}
	loadPrefs(readPrefs);
}

document.getElementById('searchKey').addEventListener('keydown', saveKey);
document.getElementById('closeKey').addEventListener('keydown', saveKey);
document.getElementById('focusKey').addEventListener('keydown', saveKey);
document.getElementById('selectKey').addEventListener('keydown', saveKey);
document.getElementById('clickKey').addEventListener('keydown', saveKey);
document.getElementById('nextKey').addEventListener('keydown', saveKey);
document.getElementById('previousKey').addEventListener('keydown', saveKey);
document.getElementById('firstKey').addEventListener('keydown', saveKey);
document.getElementById('lastKey').addEventListener('keydown', saveKey);
document.getElementById('highlightOutline').addEventListener('input', saveValue);
document.getElementById('selectOutline').addEventListener('input', saveValue);
document.getElementById('selectScroll').addEventListener('input', saveValue);
document.getElementById('debugMatches').addEventListener('change', saveChecked);

document.getElementById('factoryReset').addEventListener('click', factoryReset);
document.addEventListener('DOMContentLoaded', getPrefs);
