globalThis.id = 1;
export function onDeleteImageClick(event) {
    const image = event.target.parentElement;
    image.remove();
}
export function onDeletePartClick(event) {
    const part = event.target.parentElement;
    part.remove();
}
export function onAddSpecClick() {
    $.get(window.location.origin + "/pc-part-tmpl.hbs", function (data) {
        const template = Handlebars.compile(data);
        document.querySelector("#pc-specs").insertAdjacentHTML("beforeend", template({ id: globalThis.id++ }));
        document
            .querySelectorAll(".part")
            .forEach((element) => element
            .querySelector("button")
            .addEventListener("click", onDeletePartClick));
    }, 'html');
}
export function onAddImageClick() {
    $.get(window.location.origin + "/image-tmpl.hbs", function (data) {
        const template = Handlebars.compile(data);
        document.querySelector("#pc-images").insertAdjacentHTML("beforeend", template({ id: globalThis.id++ }));
        document
            .querySelectorAll(".image")
            .forEach((element) => element
            .querySelector("button")
            .addEventListener("click", onDeleteImageClick));
    }, 'html');
}
export function addEventsToPartsImages() {
    const partSection = document.querySelector("#add-part");
    if (partSection != null) {
        partSection.addEventListener("click", onAddSpecClick);
    }
    const imageSection = document.querySelector("#add-image");
    if (partSection != null) {
        imageSection.addEventListener("click", onAddImageClick);
    }
}
