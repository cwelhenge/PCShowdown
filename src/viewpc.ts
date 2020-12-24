import {
	addEventsToPartsImages,
	onAddImageClick,
	onAddSpecClick,
	removeError,
	showError,
	validateAndReturn,
} from "./modules/pc-module.js";

/**
 * Adds buttons and initializes the page
 */
function viewPc() {
	addEventsToPartsImages();
	const updateButton = document.querySelector("#update");
	if (updateButton) {
		updateButton.addEventListener("click", onUpdateClick);
	}
	const deleteButton = document.querySelector("#delete");
	if (deleteButton) {
		deleteButton.addEventListener("click", onDeleteClick);
	}
	getPc(window.location.pathname.split("/")[2]);
}

/**
 * Gets pc belong to the link
 * @param link_id link for the pc
 */
function getPc(link_id: string) {
	let client: XMLHttpRequest = new XMLHttpRequest();
	client.onload = getPcInfo;
	client.open("GET", window.location.origin + "/api/v1/pcs/" + link_id);
	client.send();
}

/**
 * Deletes a given pc by calling API
 */
function onDeleteClick() {
	const pc = prompt("Please enter the edit link id to delete the PC", "");
	if (pc != window.location.pathname.split("/")[2]) {
		return;
	}
	let client: XMLHttpRequest = new XMLHttpRequest();
	client.onload = deletePc;
	client.open(
		"DELETE",
		window.location.origin + "/api/v1" + window.location.pathname
	);
	client.send();
}

/**
 * Deletes a given pc
 * Source: https://xhr.spec.whatwg.org/
 * @param this request made
 */
function deletePc(this: XMLHttpRequest) {
	if (this.status == 200) {
		removeError();
		window.location.replace(window.location.origin);
	} else {
		showError();
	}
}

/**
 * Updates the given pc with new info
 */
function onUpdateClick() {
	const pc = validateAndReturn();
	if (pc != null) {
		removeError();
		let client: XMLHttpRequest = new XMLHttpRequest();
		client.onload = updatePcInfo;
		client.open(
			"PUT",
			window.location.origin + "/api/v1" + window.location.pathname
		);
		client.send(JSON.stringify(pc));
	} else {
		showError();
	}
}

/**
 * Updates pc and reloads the page
 * Source: https://xhr.spec.whatwg.org/
 * @param this xml http request
 */
function updatePcInfo(this: XMLHttpRequest) {
	if (this.status == 200) {
		removeError();
		window.location.reload();
	} else {
		showError();
	}
}

/**
 * Gets PC info and populates the page
 * Source: https://xhr.spec.whatwg.org/
 * @param this xml http request
 */
function getPcInfo(this: XMLHttpRequest) {
	if (this.status == 200) {
		removeError();
		const pc = JSON.parse(this.response);
		populatePcInfo(pc);
	} else {
		showError();
	}
}

/**
 * Populates the page with new pc info
 * @param pc PC info
 */
function populatePcInfo(pc: any) {
	for (const part of pc.parts) {
		onAddSpecClick(part, pc.links);
	}
	if (pc.images) {
		for (const image of pc.images) {
			onAddImageClick(image.link, pc.links);
		}
	}
}

window.addEventListener("DOMContentLoaded", viewPc);
