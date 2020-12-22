import {
    addEventsToPartsImages,
    onDeletePartClick,
} from "./modules/pc-module.js";

let viewPcId: number = 1;

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
        lolTest(part, pc.links);
    }
}

function lolTest(part: any, links: any) {
    // get pc-part template and add it to the page
    $.get(
        window.location.origin + "/pc-part-tmpl.hbs",
        function (data) {
            const template = Handlebars.compile(data);

            document
                .querySelector("#pc-specs")
                .insertAdjacentHTML(
                    "beforeend",
                    template({ id: globalThis.id, part: part, links: links })
                );

            let typeElm: HTMLSelectElement = document.querySelector("#type" + globalThis.id);
            typeElm.value = part.type;

            globalThis.id++;

            // Add remove buttons
            document
                .querySelectorAll(".part")
                .forEach((element) =>
                    element.querySelector("button")
                        .addEventListener("click", onDeletePartClick)
                );
        },
        "html"
    );
}

window.addEventListener("DOMContentLoaded", viewPc);
