import { validateAndReturn } from "./modules/pc-module.js";

// Global id coutner for ids for elements

/**
 * main function handles when DOM loaded
 */
function addpc() {
	document
		.querySelector("#submit")
		.addEventListener("click", onSubmitButtonClick);
}

/**
 * Get the user-entered pc specs and
 * submit a request to API
 */
function onSubmitButtonClick() {
	let pc = validateAndReturn();
	if (pc != null) {
		let client: XMLHttpRequest = new XMLHttpRequest();
		client.onload = submitPcInfo;
		client.open("POST", window.location.origin + "/api/v1/pcs");
		client.send(JSON.stringify(pc));
	} else {
		// TODO DO ERROR
	}
}

// Source: https://xhr.spec.whatwg.org/
function submitPcInfo(this: XMLHttpRequest) {
	if (this.status == 200) {
		// success!
		location.assign(
			window.location.origin + "/pcs/" + JSON.parse(this.response).editId
		);
	} else {
		//TODO ERROR
		console.log("Request unsuccess.");
	}
}

window.addEventListener("DOMContentLoaded", addpc);
