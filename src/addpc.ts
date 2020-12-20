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
 * TODO
 */
function onSubmitButtonClick() {
  console.log("Submit button clicked.");
  onSubmitCheckFields();
}

function onSubmitCheckFields() {
  let form = document.querySelector("form");
}

/**
 * TODO
 */
function onResetButtonClick() {
  console.log("Reset button clicked.");
}

/**
 * Remove a part given the remove button event
 * @param event Event associated with the click
 */
function onDeletePartClick(event: any) {
  // get parent part
  let part: HTMLElement = event.target.parentElement;
  part.remove();
}
/**
 * Adds a part to the pc specs area
 */
function onAddSpecClick() {
  let templateInfo = document.querySelector("#pc-specs-templ").innerHTML;
  let template = Handlebars.compile(templateInfo);

  let data = template({});

  document.querySelector("#pc-specs").insertAdjacentHTML("beforeend", data);

  document
    .querySelectorAll(".part")
    .forEach((element) =>
      element
        .querySelector("button")
        .addEventListener("click", onDeletePartClick)
    );
}

window.addEventListener("DOMContentLoaded", main);
