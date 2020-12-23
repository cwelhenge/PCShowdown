import { addEventsToPartsImages, removeError, showError, validateAndReturn, } from "./modules/pc-module.js";
function addpc() {
    document
        .querySelector("#submit")
        .addEventListener("click", onSubmitButtonClick);
    addEventsToPartsImages();
}
function onSubmitButtonClick() {
    let pc = validateAndReturn();
    if (pc != null) {
        removeError();
        let client = new XMLHttpRequest();
        client.onload = submitPcInfo;
        client.open("POST", window.location.origin + "/api/v1/pcs");
        client.send(JSON.stringify(pc));
    }
    else {
        showError();
    }
}
function submitPcInfo() {
    if (this.status == 200) {
        removeError();
        location.assign(window.location.origin + "/pcs/" + JSON.parse(this.response).editId);
    }
    else {
        showError();
    }
}
window.addEventListener("DOMContentLoaded", addpc);
