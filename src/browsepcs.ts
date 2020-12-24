let page_number = 0;
const limit = 10;

/**
 * Main function on load of page
 */
function browsepc() {
	getResults();
	document.querySelector("#next").addEventListener("click", onNextButtonClick);
	document.querySelector("#prev").addEventListener("click", onPrevButtonClick);
}

/**
 * Gets next page
 */
function onNextButtonClick() {
	page_number += limit + 1;
	getResults();
}
/**
 * Gets previous page
 */
function onPrevButtonClick() {
	// Page number must be positive
	if (page_number <= 0) {
		page_number = 0;
		return;
	}
	page_number -= limit + 1;
	getResults();
}

/**
 * Calls API to get results
 */
function getResults() {
	let client: XMLHttpRequest = new XMLHttpRequest();
	client.onload = requestPcResults;
	client.open(
		"GET",
		window.location.origin + "/api/v1/pcs/" + page_number + "/" + limit
	);
	client.send();
}

// Source: https://xhr.spec.whatwg.org/
/**
 * Adds results to a result list upon http request
 * @param this the request object
 */
function requestPcResults(this: XMLHttpRequest) {
	if (this.status == 200) {
		// remove existing results
		$("#results").empty();

		const results = JSON.parse(this.response);
		if (results) {
			for (const result of results) {
				addResult(result);
			}
		} else {
			page_number -= limit + 1;
			getResults();
			return;
		}
	} else {
		// TODO ERROR
	}
}

/**
 * Adds a result to the results element
 * @param result result to add to results
 */
function addResult(result: any) {
	$.get(
		window.location.origin + "/templates/result-tmpl.hbs",
		function (data) {
			const template = Handlebars.compile(data);
			document.querySelector("#results").insertAdjacentHTML(
				"beforeend",
				template({
					link: window.location.origin + "/pcs/" + result.viewId,
					name: result.name,
					info: result.info,
				})
			);
		},
		"html"
	);
}

window.addEventListener("DOMContentLoaded", browsepc);
