require("dotenv").config();

const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");


/* GET home page. */
router.get("/", (req, res, next) => {
	console.log("/ here");

	res.render("index", { title: "Express" });
});

router.get("/login", (req, res, next) => {
	console.log(req.url);

	res.render("login", { message: "로그인" });
});

router.get("/join", (req, res, next) => {
	res.render("join");
});

router.post("/join", async (req, res) => {
	try {
		const { email, nickname, password, password2 } = req.body;

		if (password !== password2) throw new Error("passwords don't match");

		const user = await new User({ email, name: nickname });
		await User.register(user, password);
		res.redirect("/");
	} catch (error) {
		console.error(error);
		res.redirect("/join");
	}
});

router.get(
	"/auth/naver/callback",
	passport.authenticate("naver"),
	(req, res) => {
		console.log("req.user: ");
		console.log(req.user);
		res.redirect("/");
	}
);

router.get("/auth/naver", passport.authenticate("naver"));

router.get(
	"/auth/kakao/callback",
	passport.authenticate("kakao"),
	(req, res) => {
		console.log("req.user: ");
		console.log(req.user);
		res.redirect("/");
	}
);
router.get("/auth/kakao", passport.authenticate("kakao"));

router.post("/auth/local", passport.authenticate("local"), (req, res) => {
	console.log(req.user);
	res.redirect("/");
});

router.post(
	"/auth/local",
	passport.authenticate("local", {
		failureRedirect: "/login",
		successRedirect: "/",
	})
);

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
