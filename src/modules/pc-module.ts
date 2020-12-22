
// global id counter for unique html ids
declare global {
    var id: number;
}

globalThis.id = 1;

/**
 * Remove an image given the remove button event
 * @param event Event associated with the click
 */
export function onDeleteImageClick(event: any) {
    // get parent image of the remove button
    const image: HTMLDivElement = event.target.parentElement;
    image.remove();
}


/**
 * Remove a part given the remove button event
 * @param event Event associated with the click
 */
export function onDeletePartClick(event: any) {
    // get parent part of the remove button
    const part: HTMLDivElement = event.target.parentElement;
    part.remove();
}
/**
 * Adds a part to the pc specs area
 */
export function onAddSpecClick() {

    // get pc-part template and add it to the page
    $.get(window.location.origin + "/pc-part-tmpl.hbs", function (data) {
        const template = Handlebars.compile(data);
        document.querySelector("#pc-specs").insertAdjacentHTML("beforeend", template({ id: globalThis.id++ }));

        // Add remove button
        document
            .querySelectorAll(".part")
            .forEach((element) =>
                element
                    .querySelector("button")
                    .addEventListener("click", onDeletePartClick)
            );
    }, 'html')
}

/**
 * Add image area upon add image button click
 */
export function onAddImageClick() {

    // get pc-image template and add it to the page
    $.get(window.location.origin + "/image-tmpl.hbs", function (data) {
        const template = Handlebars.compile(data);
        document.querySelector("#pc-images").insertAdjacentHTML("beforeend", template({ id: globalThis.id++ }));

        // Add remove button
        document
            .querySelectorAll(".image")
            .forEach((element) =>
                element
                    .querySelector("button")
                    .addEventListener("click", onDeleteImageClick)
            );
    }, 'html')
}




/**
 * Adds events to parts and images
 */
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