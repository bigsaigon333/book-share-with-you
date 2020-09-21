const express = require("express");
const Book = require("../models/Book");
const router = express.Router();

const map = new Map();

router.get("/", async (req, res) => {
	const name = req.body.name;

	try {
		const recentlyAddedBooks = await Book.find({});
		console.log(recentlyAddedBooks);
		res.render("books/index", { books: recentlyAddedBooks });
	} catch (error) {
		console.error(error);
		// res.redirect("")
		res.render("books/index", { book: { name: "Hello World" } });
	}
});

router.get("/search", (req, res) => {
	const { title } = req.query;
	// console.log(`title: ${title}`);

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
			console.log(json.errorCode);
			if (json.errorCode) throw new Error(json.errorMessage);

			const filteredBooks = json.items.filter((item) => {
				if (item.isbn === "") return false;

				item.isbn = item.isbn.replace(/<b>|<\/b>/gi, "").split(" ")[1];
				return true;
			});

			const parsedBooks = filteredBooks.map((item) => {
				const book = {};
				Object.keys(item).forEach((key) => {
					book[key] = item[key].replace(/(<b>)|(<\/b>)/gi, "");
					// console.log(item[key]);
				});
				const isbn = book.isbn;
				if (!map.has(isbn)) map.set(isbn, book);
				return book;
			});

			res.render("books/search", { title: title, books: filteredBooks });
		})
		.catch((error) => {
			console.error(error);
			res.redirect("/books/search");
		});
});

router.post("/:isbn", async (req, res) => {
	console.log(Object.entries(req.body));

	const { isbn } = req.params;

	try {
		const book = new Book(map.get(isbn));
		book.isbn = isbn;
		book.quantity = req.body.quantity;
		await book.save();

		// console.log(book);
	} catch (error) {
		console.error(error);
	}

	res.redirect("/books");
});

router.get("/new/:isbn", (req, res) => {
	console.log(req.params);

	const { isbn } = req.params;
	const book = map.get(isbn);
	res.render("books/new", { book, isbn });
});

/*  item sample
{
	title: '아메리카 <b>심</b>시티 8/완결',
	link: 'http://book.naver.com/bookdb/book_detail.php?bid=16428170',
	image: 'https://bookthumb-phinf.pstatic.net/cover/164/281/16428170.jpg?type=m1&udate=20200724',
	author: '성실글쟁이',
	price: '3200',
	discount: '',
	publisher: '문피아',
	pubdate: '20200625',
	isbn: '1101778148 9791101778141',
	description: '지구를 향해 다가오는 거대 소행성 나르바스. 인류의 종말이 코앞에 다가왔을 때.\n' +
		'김기우는 기적적인 확률을 뚫고, 현대에서 메고 온 가방과 함께 과거에 도착하는데…….\n' +
		'‘인디언?’\n' +
		'김기우가 도착한 곳은 다름 아닌 신대륙이 발견되기 이전의 아메리카!\n' +
		'인류가 생존하기 위해선 나르바스 충돌 전까지 문명을 더... '
}
 */
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
