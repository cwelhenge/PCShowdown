import { addEventsToPartsImages, onAddImageClick, onAddSpecClick, validateAndReturn, } from "./modules/pc-module.js";
function viewPc() {
    addEventsToPartsImages();
    const updateButton = document.querySelector("#update");
    if (updateButton != null) {
        updateButton.addEventListener("click", onUpdateClick);
    }
    getPc(window.location.pathname.split("/")[2]);
}
function getPc(link_id) {
    let client = new XMLHttpRequest();
    client.onload = getPcInfo;
    client.open("GET", window.location.origin + "/api/v1/pcs/" + link_id);
    client.send();
}
function onUpdateClick() {
    const pc = validateAndReturn();
    if (pc != null) {
        let client = new XMLHttpRequest();
        client.onload = updatePcInfo;
        client.open("PUT", window.location.origin + "/api/v1" + window.location.pathname);
        client.send(JSON.stringify(pc));
    }
    else {
    }
}
function updatePcInfo() {
    if (this.status == 200) {
        location.assign(window.location.origin + "/pcs/" + JSON.parse(this.response).links.editId);
    }
    else {
        console.log("Request unsuccess.");
    }
}
function getPcInfo() {
    if (this.status == 200) {
        const pc = JSON.parse(this.response);
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
    if (pc.images) {
        for (const image of pc.images) {
            onAddImageClick(image.link, pc.links);
        }
    }
}
window.addEventListener("DOMContentLoaded", viewPc);
