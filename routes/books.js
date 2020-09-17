const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	const name = req.body.name;

	res.render("books/index", { book: { name: "Hello World" } });
});

router.get("/search", async (req, res) => {
	const { title } = req.query;

	if (title === undefined) {
		res.render("books/search", { title: "", books: null });
	}
	try {
		const json = await getBookData(title);

		console.log(json.items);
		res.render("books/search", { title: title || "", books: json.items });
	} catch (error) {
		console.error(error);
	}
});

async function getBookData(title) {
	if (title === undefined || title === null || title === "") return;

	const request = require("request");
	const fetch = require("node-fetch");
	const url = new URL("https://openapi.naver.com/v1/search/book.json");

	const options = {
		query: title,
		start: 1,
		display: 3,
	};

	url.search = new URLSearchParams(options).toString();

	const headers = {
		"X-Naver-Client-ID": process.env.NAVER_CLIENT_ID,
		"X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
	};

	// console.log(url);

	try {
		const response = await fetch(url, {
			method: "GET",
			// body: options,
			headers,
		});
		const json = await response.json();
		console.log(json);
		return json;
	} catch (error) {
		console.error(error);
	}
}

module.exports = router;
