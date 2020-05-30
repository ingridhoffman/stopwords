// VARIABLES
const dataURL = "http://localhost:9200/messages/_mapping";
let data = {};
let wordList = [];

// APPLICATION
// When document is ready
$(function () {
	// Initialize page
	initPage();
	console.log("wordlist: ", wordList);

	// Listen for Add Word button
	$("#addBtn").on("click", (event) => {
		const newWord = $("#addInput").val();
		console.log("new word: ", newWord);
		wordList.push(newWord);
		console.log("wordlist: ", wordList);
		showList(wordList);
		// await updateData();
		console.log("Added word to list!");
		$("#addInput").val("");
	});
	// Listen for Delete buttons
	$("#stopWords").on("click", ".delete", function (event) {
		event.preventDefault();
		const deleteWord = $(this).siblings(".word").text();
		console.log("delete:", deleteWord);
		wordList = wordList.filter((word) => word !== deleteWord);
		console.log("wordlist: ", wordList);
		showList(wordList);
		console.log("Deleted word from list!");
	});
	// Listen for Submit Changes button
	$("#update").on("click", (event) => {
		data.messages.settings.index.analysis.analyzer.my_stop.stopwords = wordList;
		console.log("data: ", data);
		putJSON(dataURL);
	});
});

// HELPER FUNCTIONS
// Initialize page - gets data file, creates word array, and displays page
async function initPage() {
	// Get data
	data = await getJSON(dataURL);
	console.log("data: ", data);
	// Get list of stopwords
	wordList = data.messages.settings.index.analysis.analyzer.my_stop.stopwords;
	console.log("wordlist: ", wordList);
	// Display stopwords on page
	showList(wordList);
}
// GET data file
async function getJSON(fileURL) {
	let response;
	try {
		response = await fetch(fileURL);
		console.log("response: ", response);
	} catch (err) {
		console.log(err);
	}
	console.log("json: ", response.json);
	return response.json();
}
// Display HTML list
function showList(list) {
	// first clear list
	$("#stopWords").empty();
	// then populate
	list.forEach((word) => {
		const listItem = `<li class="list-group-item d-flex">
			<div class="flex-fill word">${word}</div>
			<button type="button" class="btn btn-sm btn-outline-danger delete">X</button>
			</li>`;
		console.log("listItem: ", listItem);
		$("#stopWords").append(listItem);
	});
}
// PUT data
async function putJSON(fileURL) {
	let response = await fetch(fileURL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8",
		},
		body: JSON.stringify(data),
	});
	let result = await response.json();
	console.log(result.message);
}
