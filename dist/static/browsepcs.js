"use strict";
let page_number = 0;
const limit = 10;
function browsepc() {
    getResults();
    document.querySelector("#next").addEventListener("click", onNextButtonClick);
    document.querySelector("#prev").addEventListener("click", onPrevButtonClick);
}
function onNextButtonClick() {
    page_number += limit + 1;
    getResults();
}
function onPrevButtonClick() {
    if (page_number <= 0) {
        page_number = 0;
        return;
    }
    page_number -= limit + 1;
    getResults();
}
function getResults() {
    let client = new XMLHttpRequest();
    client.onload = requestPcResults;
    client.open("GET", window.location.origin + "/api/v1/pcs/" + page_number + "/" + limit);
    client.send();
}
function requestPcResults() {
    if (this.status == 200) {
        $("#results").empty();
        const results = JSON.parse(this.response);
        if (results) {
            for (const result of results) {
                addResult(result);
            }
        }
        else {
            page_number -= limit + 1;
            getResults();
            return;
        }
    }
    else {
    }
}
function addResult(result) {
    $.get(window.location.origin + "/modules/templates/result-tmpl.hbs", function (data) {
        const template = Handlebars.compile(data);
        document.querySelector("#results").insertAdjacentHTML("beforeend", template({
            link: window.location.origin + "/pcs/" + result.viewId,
            name: result.name,
            info: result.info,
        }));
    }, "html");
}
window.addEventListener("DOMContentLoaded", browsepc);
