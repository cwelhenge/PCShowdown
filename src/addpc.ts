import {
	addEventsToPartsImages,
	removeError,
	showError,
	validateAndReturn,
} from "./modules/pc-module.js";

// Global id coutner for ids for elements

/**
 * main function handles when DOM loaded
 */
function addpc() {
	document
		.querySelector("#submit")
		.addEventListener("click", onSubmitButtonClick);
	addEventsToPartsImages();
}

/**
 * Get the user-entered pc specs and
 * submit a request to API
 */
function onSubmitButtonClick() {
	let pc = validateAndReturn();
	if (pc != null) {
		removeError();
		let client: XMLHttpRequest = new XMLHttpRequest();
		client.onload = submitPcInfo;
		client.open("POST", window.location.origin + "/api/v1/pcs");
		client.send(JSON.stringify(pc));
	} else {
		showError();
	}
}

// Source: https://xhr.spec.whatwg.org/
function submitPcInfo(this: XMLHttpRequest) {
	if (this.status == 200) {
		removeError();
		location.assign(
			window.location.origin + "/pcs/" + JSON.parse(this.response).editId
		);
	} else {
		showError();
	}
}

window.addEventListener("DOMContentLoaded", addpc);
