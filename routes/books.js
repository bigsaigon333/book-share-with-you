const express = require("express");
const BookInfo = require("../models/BookInfo");
const RegisteredBook = require("../models/RegisteredBook");
const User = require("../models/User");
const router = express.Router();

router.get("/", async (req, res) => {
	// const name = req.body.name;

	try {
		const recentlyAddedBooks = await RegisteredBook.find({})
			.populate("info")
			.sort({
				registeredAt: "desc",
			});

		console.log(recentlyAddedBooks);

		res.render("books/index", { books: recentlyAddedBooks });
	} catch (error) {
		console.error(error);
		req.flash("error", error);
		// res.redirect("")
		res.render("books/index", { book: { name: "Hello World" } });
	}
});

router.get("/search", async (req, res) => {
	const { title } = req.query;
	// console.log(`title: ${title}`);

	if (title === undefined || title === "") {
		res.render("books/search", { title: "" });
		return;
	}

	try {
		const result = await getBookData(title);
		const json = await result.json();

		const filteredBooks = json.items.filter((item) => {
			if (item.isbn === "") return false;

			item.isbn = item.isbn.replace(/<b>|<\/b>/gi, "").split(" ")[1];
			return true;
		});

		res.render("books/search", { title: title, books: filteredBooks });

		// console.log(filteredBooks);

		const validatedBooks = filteredBooks.filter((item) => {
			return (
				item.title && item.author && item.publisher && item.pubdate && item.isbn
			);
		});

		const parsedBooks = validatedBooks.map(async (item) => {
			const newBook = new BookInfo();
			Object.keys(item).forEach((key) => {
				newBook[key] = item[key].replace(/(<b>)|(<\/b>)/gi, "");
				// console.log(item[key]);
				// console.log(book);
			});

			const savedBook = await BookInfo.findOne({ isbn: newBook.isbn });
			// console.log(savedBook);

			if (!savedBook) {
				try {
					newBook.save();
				} catch (error) {}
			}

			return newBook;
		});
	} catch (error) {
		console.error(error);
		req.flash("error", error.message);
		res.redirect("/books/search");
	}
});

router.post("/new/:isbn", async (req, res) => {
	const { isbn } = req.params;
	const {
		sharePlace: sharePlace,
		itroducingComment: introducingComment,
	} = req.body;

	try {
		const newBook = new RegisteredBook();
		newBook.isbn = isbn;
		newBook.owner = req.user._id;
		newBook.sharePlace = sharePlace;
		newBook.introducingComment = introducingComment;

		const bookInfo = await BookInfo.findOne({ isbn });
		newBook.info = bookInfo.id;

		await newBook.save();

		const owner = await User.findById(req.user._id);
		owner.owns.push(newBook.id);
		console.log(owner.owns);
		await owner.save();

		res.redirect("/books");

		// TO DO
		// 등록된 책 상세내용 표시 화면 만들기
	} catch (error) {
		console.error(error);
		req.flash("error", error);
		res.redirect("/books");
	}
});

router.get("/new/:isbn", async (req, res) => {
	console.log(req.params);

	const { isbn } = req.params;
	try {
		const book = await BookInfo.findOne({ isbn });
		res.render("books/new", { book });
	} catch (error) {
		req.flash("error", error);
		res.redirect(`/books/search?title=${isbn}`);
	}
});

async function getBookData(title) {
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

	try {
		return await fetch(url, {
			method: "GET",
			headers,
		});
	} catch (error) {
		req.flash("error", error);
		return error;
	}
}
module.exports = router;
