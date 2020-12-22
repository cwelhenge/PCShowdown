import { addEventsToPartsImages } from "./modules/pc-module.js";
function addpc() {
    document
        .querySelector("#submit")
        .addEventListener("click", onSubmitButtonClick);
    document
        .querySelector("#reset")
        .addEventListener("click", onResetButtonClick);
    addEventsToPartsImages();
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
        console.log(this.response);
    }
    else {
        console.log("Request unsuccess.");
    }
}
class Part {
    constructor() {
        this.type = "";
        this.brand = "";
        this.model = "";
        this.qty = 1;
    }
}
class PC {
    constructor() {
        this.name = "";
        this.info = "";
        this.parts = [];
        this.images = [];
    }
    validateParts() {
        for (const prop of [
            "cpu",
            "gpu",
            "psu",
            "case",
            "disk",
            "mobo",
            "ram",
            "cooler",
        ]) {
            const exist = this.parts.some((el) => el.type === prop);
            if (!exist) {
                return false;
            }
        }
        return true;
    }
}
class ImageLink {
}
function validateAndReturn() {
    let spec = new PC();
    let form = document.querySelector("form");
    if (!form.reportValidity()) {
        return;
    }
    let name = form.querySelector("#name");
    let info = form.querySelector("#info");
    spec.name = name.value;
    spec.info = info.value;
    let parts = form.querySelectorAll(".part");
    for (const part of parts) {
        let partObj = new Part();
        partObj.type = part.querySelector(".type").value;
        partObj.brand = part.querySelector(".brand").value;
        partObj.model = part.querySelector(".model").value;
        partObj.qty = parseInt(part.querySelector(".qty").value);
        spec.parts.push(partObj);
    }
    if (!spec.validateParts()) {
        console.log("Missing required specs.");
        return null;
    }
    let images = form.querySelectorAll(".image-link");
    for (const image of images) {
        let img = new ImageLink();
        img.link = image.value;
        spec.images.push(img);
    }
    return spec;
}
function onResetButtonClick() {
    console.log("Reset button clicked.");
    let form = document.querySelector("form");
    form.reset();
}
window.addEventListener("DOMContentLoaded", addpc);
