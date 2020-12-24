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
export function onAddSpecClick(part: any, links: any) {
	// get pc-part template and add it to the page
	$.get(
		window.location.origin + "/templates/pc-part-tmpl.hbs",
		function (data) {
			const template = Handlebars.compile(data);
			// add part
			document
				.querySelector("#pc-specs")
				.insertAdjacentHTML(
					"beforeend",
					template({ id: globalThis.id, links: links, part: part })
				);

			if (part != null) {
				// set the type value
				let typeElm: HTMLSelectElement = document.querySelector(
					"#type" + globalThis.id
				);
				typeElm.value = part.type;
			}

			globalThis.id++;

			// add remove button action if button exist
			const parts = document.querySelectorAll(".part");
			if (parts != null) {
				parts.forEach((element) => {
					const remButton = element.querySelector("button");
					if (remButton != null) {
						remButton.addEventListener("click", onDeletePartClick);
					}
				});
			}
		},
		"html"
	);
}

/**
 * Add image area upon add image button click
 */
export function onAddImageClick(imageLink: any, links: any) {
	// get pc-image template and add it to the page
	$.get(
		window.location.origin + "/templates/image-tmpl.hbs",
		function (data) {
			const template = Handlebars.compile(data);
			document
				.querySelector("#pc-images")
				.insertAdjacentHTML(
					"beforeend",
					template({ id: globalThis.id++, links: links, link: imageLink })
				);

			// Add remove buttons
			const images = document.querySelectorAll(".image");
			if (images != null) {
				images.forEach((element) => {
					const remButton = element.querySelector("button");
					if (remButton != null) {
						remButton.addEventListener("click", onDeleteImageClick);
					}
				});
			}
		},
		"html"
	);
}

/**
 * Adds events to parts and images
 */
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

/**
 * A part object containing part info
 * verify method to check for empty values
 */
class Part {
	type: string;
	brand: string;
	model: string;
	qty: number;
	constructor() {
		this.type = "";
		this.brand = "";
		this.model = "";
		this.qty = 1;
	}
}

/**
 * Spec object containing PC info
 */
class PC {
	name: string;
	info: string;
	parts: Part[];
	images: ImageLink[];
	constructor() {
		this.name = "";
		this.info = "";
		this.parts = [];
		this.images = [];
	}

	/**
	 * Check if at least a required component is missing.
	 */
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
	link: string;
}

/**
 * Check for validity and get the values
 * return null if error
 */
export function validateAndReturn() {
	let spec = new PC();

	let form: HTMLFormElement = document.querySelector("form");
	if (!form.reportValidity()) {
		return;
	}
	let name: HTMLTextAreaElement = form.querySelector("#name");
	let info: HTMLTextAreaElement = form.querySelector("#info");
	spec.name = name.value;
	spec.info = info.value;

	// Get all parts and put in the parts array
	let parts = form.querySelectorAll(".part");
	for (const part of parts) {
		let partObj = new Part();
		partObj.type = (part.querySelector(".type") as HTMLTextAreaElement).value;
		partObj.brand = (part.querySelector(".brand") as HTMLTextAreaElement).value;
		partObj.model = (part.querySelector(".model") as HTMLTextAreaElement).value;
		partObj.qty = parseInt(
			(part.querySelector(".qty") as HTMLTextAreaElement).value
		);
		spec.parts.push(partObj);
	}

	// Check for required components
	if (!spec.validateParts()) {
		return null;
	}

	// Get all images
	let images = form.querySelectorAll(".image-link");
	for (const image of images) {
		let img = new ImageLink();
		img.link = (image as HTMLTextAreaElement).value;
		spec.images.push(img);
	}
	return spec;
}

export function showError() {
	const error = document.querySelector("#submit-error");
	if (error) {
		error.classList.remove("hidden");
		error.classList.add("show");
	}
}

export function removeError() {
	const error = document.querySelector("#submit-error");
	if (error) {
		error.classList.remove("show");
		error.classList.add("hidden");
	}
}
