globalThis.id = 1;
export function onDeleteImageClick(event) {
    const image = event.target.parentElement;
    image.remove();
}
export function onDeletePartClick(event) {
    const part = event.target.parentElement;
    part.remove();
}
export function onAddSpecClick(part, links) {
    $.get(window.location.origin + "/modules/templates/pc-part-tmpl.hbs", function (data) {
        const template = Handlebars.compile(data);
        document
            .querySelector("#pc-specs")
            .insertAdjacentHTML("beforeend", template({ id: globalThis.id, links: links, part: part }));
        if (part != null) {
            let typeElm = document.querySelector("#type" + globalThis.id);
            typeElm.value = part.type;
        }
        globalThis.id++;
        const parts = document.querySelectorAll(".part");
        if (parts != null) {
            parts.forEach((element) => {
                const remButton = element.querySelector("button");
                if (remButton != null) {
                    remButton.addEventListener("click", onDeletePartClick);
                }
            });
        }
    }, "html");
}
export function onAddImageClick(imageLink, links) {
    $.get(window.location.origin + "/modules/templates/image-tmpl.hbs", function (data) {
        const template = Handlebars.compile(data);
        document
            .querySelector("#pc-images")
            .insertAdjacentHTML("beforeend", template({ id: globalThis.id++, links: links, link: imageLink }));
        const images = document.querySelectorAll(".image");
        if (images != null) {
            images.forEach((element) => {
                const remButton = element.querySelector("button");
                if (remButton != null) {
                    remButton.addEventListener("click", onDeleteImageClick);
                }
            });
        }
    }, "html");
}
export function addEventsToPartsImages() {
    const partSection = document.querySelector("#add-part");
    if (partSection != null) {
        partSection.addEventListener("click", function () {
            onAddSpecClick(null, { editId: true, viewId: true });
        });
    }
    const imageSection = document.querySelector("#add-image");
    if (partSection != null) {
        imageSection.addEventListener("click", function () {
            onAddImageClick("", { editId: true, viewId: true });
        });
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
export function validateAndReturn() {
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
