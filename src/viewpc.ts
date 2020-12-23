import {
	addEventsToPartsImages,
	onAddImageClick,
	onAddSpecClick,
	validateAndReturn,
} from "./modules/pc-module.js";

function viewPc() {
	addEventsToPartsImages();

	const updateButton = document.querySelector("#update");
	if (updateButton != null) {
		updateButton.addEventListener("click", onUpdateClick);
	}
	getPc(window.location.pathname.split("/")[2]);
}

function getPc(link_id: string) {
	let client: XMLHttpRequest = new XMLHttpRequest();
	client.onload = getPcInfo;
	client.open("GET", window.location.origin + "/api/v1/pcs/" + link_id);
	client.send();
}

function onUpdateClick() {
	const pc = validateAndReturn();
	if (pc != null) {
		let client: XMLHttpRequest = new XMLHttpRequest();
		client.onload = updatePcInfo;
		client.open(
			"PUT",
			window.location.origin + "/api/v1" + window.location.pathname
		);
		client.send(JSON.stringify(pc));
	} else {
		// TODO DO ERROR
	}
}

// Source: https://xhr.spec.whatwg.org/
function updatePcInfo(this: XMLHttpRequest) {
	if (this.status == 200) {
		// success!
		location.assign(
			window.location.origin + "/pcs/" + JSON.parse(this.response).links.editId
		);
	} else {
		//TODO ERROR
		console.log("Request unsuccess.");
	}
}

// Source: https://xhr.spec.whatwg.org/
function getPcInfo(this: XMLHttpRequest) {
	if (this.status == 200) {
		const pc = JSON.parse(this.response);

		populatePcInfo(pc);
	} else {
		//TODO ERROR
		console.log("Request unsuccess.");
	}
}

function populatePcInfo(pc: any) {
	for (const part of pc.parts) {
		// lolTest(part, pc.links);
		onAddSpecClick(part, pc.links);
	}
	if (pc.images) {
		for (const image of pc.images) {
			// addImages(image.link, pc.links)
			onAddImageClick(image.link, pc.links);
		}
	}
}

window.addEventListener("DOMContentLoaded", viewPc);
