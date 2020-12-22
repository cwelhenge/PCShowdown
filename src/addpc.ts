import { addEventsToPartsImages } from "./modules/pc-module.js";

// Global id coutner for ids for elements


/**
 * main function handles when DOM loaded
 */
function addpc() {
  document
    .querySelector("#submit")
    .addEventListener("click", onSubmitButtonClick);
  document
    .querySelector("#reset")
    .addEventListener("click", onResetButtonClick);
  addEventsToPartsImages();

}

/**
 * Get the user-entered pc specs and
 * submit a request to API
 */
function onSubmitButtonClick() {
  let pc = validateAndReturn();
  if (pc != null) {
    let client: XMLHttpRequest = new XMLHttpRequest();
    client.onload = submitPcInfo;
    client.open("POST", window.location.origin + "/api/v1/pcs");
    client.send(JSON.stringify(pc));
  }
  else {

    // TODO DO ERROR
  }
}

// Source: https://xhr.spec.whatwg.org/
function submitPcInfo(this: XMLHttpRequest) {
  if (this.status == 200) {
    // success!
    // TODO LOAD TO NEW PAGE
    console.log(this.response);

  } else {
    //TODO ERROR
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

window.addEventListener("DOMContentLoaded", addpc);
