"use strict";
function main() {
    document
        .querySelector("#submit")
        .addEventListener("click", onSubmitButtonClick);
    document
        .querySelector("#reset")
        .addEventListener("click", onResetButtonClick);
    document.querySelector("#add-part").addEventListener("click", onAddSpecClick);
    document.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            onSubmitButtonClick();
        }
    });
}
function onSubmitButtonClick() {
    console.log("Submit button clicked.");
    onSubmitCheckFields();
}
function onSubmitCheckFields() {
    let form = document.querySelector("form");
}
function onResetButtonClick() {
    console.log("Reset button clicked.");
}
function onDeletePartClick(event) {
    let part = event.target.parentElement;
    part.remove();
}
function onAddSpecClick() {
    let templateInfo = document.querySelector("#pc-specs-templ").innerHTML;
    let template = Handlebars.compile(templateInfo);
    let data = template({});
    document.querySelector("#pc-specs").insertAdjacentHTML("beforeend", data);
    document
        .querySelectorAll(".part")
        .forEach((element) => element
        .querySelector("button")
        .addEventListener("click", onDeletePartClick));
}
window.addEventListener("DOMContentLoaded", main);
