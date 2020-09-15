require("dotenv").config();

var express = require("express");
var router = express.Router();

const request = require("request");

/* GET home page. */
router.get("/", (req, res, next) => {
	console.log("/ here");

	res.render("index", { title: "Express" });
});

module.exports = router;
