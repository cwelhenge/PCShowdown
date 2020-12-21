// Global id coutner for ids for elements
let id = 1;

/**
 * main function handles when DOM loaded
 */
function main() {
  document
    .querySelector("#submit")
    .addEventListener("click", onSubmitButtonClick);
  document
    .querySelector("#reset")
    .addEventListener("click", onResetButtonClick);
  document.querySelector("#add-part").addEventListener("click", onAddSpecClick);
  document
    .querySelector("#add-image")
    .addEventListener("click", onAddImageClick);
  // Source: https://stackoverflow.com/a/63104461
  document.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      onSubmitButtonClick();
    }
  });
}

/**
 * TODO add comments
 */
function onSubmitButtonClick() {
  let pc = validateAndReturn();
  if (pc != null) {
    let client: XMLHttpRequest = new XMLHttpRequest();
    client.onload = handler;
    client.open("POST", window.location.origin + "/api/v1/pcs");
    client.send(JSON.stringify(pc));
  }
}

// Source: https://xhr.spec.whatwg.org/
function handler(this: XMLHttpRequest) {
  if (this.status == 200) {
    // success!
    console.log(this.response);

  } else {
    console.log("Request unsuccess.");
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
 */
function validateAndReturn() {
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
    console.log("Missing required specs.");
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

/**
 * TODO
 */
function onResetButtonClick() {
  console.log("Reset button clicked.");
  let form: HTMLFormElement = document.querySelector("form");
  form.reset();
}

/**
 * Remove a part given the remove button event
 * @param event Event associated with the click
 */
function onDeletePartClick(event: any) {
  // get parent part of the remove button
  let part: HTMLDivElement = event.target.parentElement;
  part.remove();
}
/**
 * Adds a part to the pc specs area
 */
function onAddSpecClick() {
  let templateInfo = document.querySelector("#pc-specs-templ").innerHTML;
  let template = Handlebars.compile(templateInfo);

  let data = template({ id: id++ });

  document.querySelector("#pc-specs").insertAdjacentHTML("beforeend", data);

  document
    .querySelectorAll(".part")
    .forEach((element) =>
      element
        .querySelector("button")
        .addEventListener("click", onDeletePartClick)
    );
}

/**
 * Remove an image given the remove button event
 * @param event Event associated with the click
 */
function onDeleteImageClick(event: any) {
  // get parent image of the remove button
  let image: HTMLDivElement = event.target.parentElement;
  image.remove();
}

/**
 * Add image area upon add image button click
 */
function onAddImageClick() {
  let templateInfo = document.querySelector("#pc-images-templ").innerHTML;
  let template = Handlebars.compile(templateInfo);

  let data = template({ id: id++ });

  document.querySelector("#pc-images").insertAdjacentHTML("beforeend", data);

  document
    .querySelectorAll(".image")
    .forEach((element) =>
      element
        .querySelector("button")
        .addEventListener("click", onDeleteImageClick)
    );
}

window.addEventListener("DOMContentLoaded", main);
