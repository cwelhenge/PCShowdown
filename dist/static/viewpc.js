import { addEventsToPartsImages, onDeletePartClick, } from "./modules/pc-module.js";
let viewPcId = 1;
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
        lolTest(part, pc.links);
    }
}
function lolTest(part, links) {
    $.get(window.location.origin + "/pc-part-tmpl.hbs", function (data) {
        const template = Handlebars.compile(data);
        document
            .querySelector("#pc-specs")
            .insertAdjacentHTML("beforeend", template({ id: globalThis.id, part: part, links: links }));
        let typeElm = document.querySelector("#type" + globalThis.id);
        typeElm.value = part.type;
        globalThis.id++;
        document
            .querySelectorAll(".part")
            .forEach((element) => element.querySelector("button")
            .addEventListener("click", onDeletePartClick));
    }, "html");
}
window.addEventListener("DOMContentLoaded", viewPc);
