const express = require("express");
const router = express.Router();
const request = require("request");

// const URL = "https://openapi.naver.com/v1/search/book.json";
// const option = {
// 	query: "동",
// 	start: 1,
// 	display: 3,
// };

// request.get(
//   {
//     uri: URL,
//     qs: option,
//     headers: {
//       "X-Naver-Client-ID": process.env.NAVER_CLIENT_ID,
//       "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
//     },
//   },
//   (err, res, body) => {
//     const json = JSON.parse(body);
//     console.log(json);
//   }
// );

router.get("/", (req, res) => {
	const name = req.body.name;

	res.render("index");
});

router.get("/new", (req, res) => {
	res.render("index");
});

module.exports = router;
