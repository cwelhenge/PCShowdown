import { validateAndReturn } from "./modules/pc-module.js";
function addpc() {
    document
        .querySelector("#submit")
        .addEventListener("click", onSubmitButtonClick);
}
function onSubmitButtonClick() {
    let pc = validateAndReturn();
    if (pc != null) {
        let client = new XMLHttpRequest();
        client.onload = submitPcInfo;
        client.open("POST", window.location.origin + "/api/v1/pcs");
        client.send(JSON.stringify(pc));
    }
    else {
    }
}
function submitPcInfo() {
    if (this.status == 200) {
        location.assign(window.location.origin + "/pcs/" + JSON.parse(this.response).editId);
    }
    else {
        console.log("Request unsuccess.");
    }
}
window.addEventListener("DOMContentLoaded", addpc);
