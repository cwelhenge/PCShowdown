import { addEventsToPartsImages, onAddImageClick, onAddSpecClick, removeError, showError, validateAndReturn, } from "./modules/pc-module.js";
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
function getPc(link_id) {
    let client = new XMLHttpRequest();
    client.onload = getPcInfo;
    client.open("GET", window.location.origin + "/api/v1/pcs/" + link_id);
    client.send();
}
function onDeleteClick() {
    const pc = prompt("Please enter the edit link id to delete the PC", "");
    if (pc != window.location.pathname.split("/")[2]) {
        return;
    }
    let client = new XMLHttpRequest();
    client.onload = deletePc;
    client.open("DELETE", window.location.origin + "/api/v1" + window.location.pathname);
    client.send();
}
function deletePc() {
    if (this.status == 200) {
        removeError();
        window.location.replace(window.location.origin);
    }
    else {
        showError();
    }
}
function onUpdateClick() {
    const pc = validateAndReturn();
    if (pc != null) {
        removeError();
        let client = new XMLHttpRequest();
        client.onload = updatePcInfo;
        client.open("PUT", window.location.origin + "/api/v1" + window.location.pathname);
        client.send(JSON.stringify(pc));
    }
    else {
        showError();
    }
}
function updatePcInfo() {
    if (this.status == 200) {
        removeError();
        window.location.reload();
    }
    else {
        showError();
    }
}
function getPcInfo() {
    if (this.status == 200) {
        removeError();
        const pc = JSON.parse(this.response);
        populatePcInfo(pc);
    }
    else {
        showError();
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
