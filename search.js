//array of DOM elements searched for
var elems = [];
//element for search input and count display
var searchbar;
//index of currently selected element in elems array
var dx = 0;

	//helper functions
//if outside limit return opposite side
function loopClamp(num, max, min=0) {
	return num < min? max : (num > max? min : num);
}
function highlightElems() {
	for(let e=0; e < elems.length; e++) {
		elems[e].style.outline = prefs.highlightOutline;
	}
}
function removeHighlights(hideSearch=true) {
	if(hideSearch)
		searchbar.style.display = 'none';
	for(let e=0; e < elems.length; e++) {
		elems[e].style.removeProperty('outline');
	}
}
//fake select elem relative to dx
function selectElem(n, set=false) {
	elems[dx].style.outline = prefs.highlightOutline;
	dx = set? n : loopClamp(dx + n, elems.length-1);
	elems[dx].style.outline = prefs.selectOutline;
	elems[dx].scrollIntoView({ block: prefs.selectScroll });
	//update elem count
	searchbar.lastElementChild.textContent = (dx+1) + '/' + elems.length;
}
function keyMatch(obj, event) {
	for(let key in obj) {
		if(obj[key] !== event[key])
			return false;
	}
	return true;
}

//listener for shortcut keys
function key(ev) {
	//start search if an input is not focused
	if(keyMatch(prefs.searchKey, ev) && ['input', 'textarea', 'select'].indexOf(document.activeElement.tagName.toLowerCase()) < 0) {
		ev.preventDefault();
		searchbar.style.removeProperty('display');
		searchbar.firstElementChild.select();
		highlightElems();
		selectElem(0);
	}
	else if(keyMatch(prefs.closeKey, ev)) {
		document.activeElement.blur();
		removeHighlights();
	}
	//keys that require elems make sure search has focus
	if(ev.target.parentElement.id !== 'HTMLSearchCLCO' || elems.length < 1)
		return;
	switch(true) {
		case keyMatch(prefs.focusKey, ev):
			ev.preventDefault();
			removeHighlights();
			elems[dx].focus();
			break;
		case keyMatch(prefs.selectKey, ev):
			ev.preventDefault();
			removeHighlights();
			//select element text if not an input
			if(['input', 'textarea'].indexOf(elems[dx].tagName.toLowerCase()) < 0) {
				const selection = window.getSelection();
				const range = document.createRange();
				range.selectNodeContents(elems[dx]);
				document.activeElement.blur();
				selection.removeAllRanges();
				selection.addRange(range);
			}
			else {
				elems[dx].focus();
				elems[dx].select();
			}
			break;
		case keyMatch(prefs.clickKey, ev):
			ev.preventDefault();
			removeHighlights();
			elems[dx].click();
			break;
		case keyMatch(prefs.nextKey, ev):
			ev.preventDefault();
			selectElem(1);
			break;
		case keyMatch(prefs.previousKey, ev):
			ev.preventDefault();
			selectElem(-1);
			break;
		case keyMatch(prefs.firstKey, ev):
			ev.preventDefault();
			selectElem(0, true);
			break;
		case keyMatch(prefs.lastKey, ev):
			ev.preventDefault();
			selectElem(elems.length-1, true);
			break;
	}
}
//main search page
function search(ev) {
	removeHighlights(false);
	elems = [];
	const matches = document.body.querySelectorAll(ev.target.value);
	//const matches = document.body.getElementsByTagName(ev.target.value);
	if(matches.length < 1) {
		//clear counter
		searchbar.lastElementChild.textContent = '0';
		return;
	}
	//add visible elements
	for(let i=0; i < matches.length; i++) {
		const style = window.getComputedStyle(matches[i]);
		if(style.display !== 'none' && style.visibility !== 'hidden') {
			elems.push(matches[i]);
		}
	}
	if(prefs.debugMatches)
		console.debug(matches);
	highlightElems();
	selectElem(0, true);
}

//update prefs on storage change
function stateChanged(changes) {
	for(let key in changes) {
		if(changes[key])
			prefs[key] = changes[key].newValue;
	}
}
function readPrefs(storage) {
	prefs = storage;
}
function init() {
	loadPrefs(readPrefs);
	chrome.storage.onChanged.addListener(stateChanged);

	//create searchbar
	searchbar = document.createElement('div');
	let input = document.createElement('input');
	let count = document.createElement('span');
	searchbar.id = 'HTMLSearchCLCO';
	searchbar.style.display = 'none';
	input.type = 'text';
	input.placeholder = 'HTML search';
	input.addEventListener('input', search);

	//construct searchbar and add to page
	searchbar.appendChild(input);
	searchbar.appendChild(count);
	document.body.appendChild(searchbar);
	document.addEventListener('keydown', key);
}
document.addEventListener('DOMContentLoaded', init);
