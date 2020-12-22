import { addEventsToPartsImages, onAddImageClick, onAddSpecClick, } from "./modules/pc-module.js";
function viewPc() {
    addEventsToPartsImages();
    getPc(window.location.pathname.split("/")[2]);
}
function getPc(link_id) {
    let client = new XMLHttpRequest();
    client.onload = getPcInfo;
    client.open("GET", window.location.origin + "/api/v1/pcs/" + link_id);
    client.send();
}
function getPcInfo() {
    if (this.status == 200) {
        let pc = JSON.parse(this.response);
        populatePcInfo(pc);
    }
    else {
        console.log("Request unsuccess.");
    }
}
function populatePcInfo(pc) {
    for (const part of pc.parts) {
        onAddSpecClick(part, pc.links);
    }
    for (const image of pc.images) {
        onAddImageClick(image.link, pc.links);
    }
}
window.addEventListener("DOMContentLoaded", viewPc);
