import {
	addEventsToPartsImages,
	onAddImageClick,
	onAddSpecClick,
} from "./modules/pc-module.js";

function viewPc() {
	addEventsToPartsImages();
	getPc(window.location.pathname.split("/")[2]);
}

function getPc(link_id: string) {
	let client: XMLHttpRequest = new XMLHttpRequest();
	client.onload = getPcInfo;
	client.open("GET", window.location.origin + "/api/v1/pcs/" + link_id);
	client.send();
}

// Source: https://xhr.spec.whatwg.org/
function getPcInfo(this: XMLHttpRequest) {
	if (this.status == 200) {
		let pc = JSON.parse(this.response);
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
	for (const image of pc.images) {
		// addImages(image.link, pc.links)
		onAddImageClick(image.link, pc.links);
	}
}

window.addEventListener("DOMContentLoaded", viewPc);
