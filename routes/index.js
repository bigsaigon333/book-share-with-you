require("dotenv").config();

const express = require("express");
const passport = require("passport");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
	console.log("/ here");

	res.render("index", { title: "Express" });
});

router.get("/login", (req, res, next) => {
	console.log(req.url);

	res.render("login", { title: "Express" });
});

// router.get(
// 	"/auth/naver/callback",

// 	(req, res) => {
// 		console.log(req);
// 		res.redirect("/");
// 	}
// );

router.get(
	"/auth/naver/callback",
	passport.authenticate("naver"),
	(req, res) => {
		res.redirect("/");
	}
);

router.get("/auth/naver", passport.authenticate("naver"));

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect("/login");
	}
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		res.redirect("/");
	} else {
		next();
	}
}

module.exports = router;
