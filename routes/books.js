const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	const name = req.body.name;

	res.render("books/index", { book: { name: "Hello World" } });
});

router.get("/search", (req, res) => {
	const { title } = req.query;
	console.log(`title: ${title}`);

	if (title === undefined || title === "") {
		res.render("books/search", { title: "" });
		return;
	}

	getBookData(title)
		.then((res) => {
			if (res == null) throw new Error(`can't find book data`);
			else return res.json();
		})
		.then((json) => {
			// console.log(json.items);
			res.render("books/search", { title: title, books: json.items });
		})
		.catch((error) => {
			console.error(error);
			res.redirect("/books/search");
		});
});

function getBookData(title) {
	const fetch = require("node-fetch");
	const url = new URL("https://openapi.naver.com/v1/search/book.json");
	const headers = {
		"X-Naver-Client-ID": process.env.NAVER_CLIENT_ID,
		"X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
	};
	const options = {
		query: title,
		// start: 1,
		// display: 3,
	};

	url.search = new URLSearchParams(options).toString();

	// console.log(url);
	return fetch(url, {
		method: "GET",
		// body: options,    // GET method에서는 body추가X
		headers,
	});
}
module.exports = router;
