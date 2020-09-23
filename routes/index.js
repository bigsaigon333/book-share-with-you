require("dotenv").config();

const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

/* GET home page. */
router.get("/", (req, res, next) => {
	res.render("index");
});

router.get("/login", checkNotAuthenticated, (req, res, next) => {
	res.render("login");
});

router.get("/join", checkNotAuthenticated, (req, res, next) => {
	res.render("join");
});

router.post(
	"/join",
	async (req, res, next) => {
		try {
			const { email, nickname, password, password2 } = req.body;

			if (password !== password2)
				throw new Error("패스워드가 일치하지 않습니다");

			const user = await new User({ email, username: nickname });
			await User.register(user, password);
			// res.redirect("/");
			return next();
		} catch (error) {
			console.error(error);
			req.flash("error", error.message);
			res.redirect("/join");
		}
	},
	passport.authenticate("local", {
		failureRedirect: "/login",
		successRedirect: "/",
		failureFlash: "E-mail 또는 비밀번호를 확인해주세요",
		successFlash: "환영합니다!",
	})
);

router.post(
	"/auth/local",
	passport.authenticate("local", {
		failureRedirect: "/login",
		successRedirect: "/",
		failureFlash: "E-mail 또는 비밀번호를 확인해주세요",
		successFlash: "환영합니다!",
	})
);

router.get(
	"/auth/naver/callback",
	passport.authenticate("naver", {
		failureRedirect: "/login",
		successRedirect: "/",
		failureFlash: "네이버 로그인에 실패하였습니다",
		successFlash: "환영합니다!",
	})
);

router.get(
	"/auth/naver",
	passport.authenticate("naver", {
		failureRedirect: "/login",
		successRedirect: "/",
		failureFlash: "네이버 로그인에 실패하였습니다",
		successFlash: "환영합니다!",
	})
);

router.get(
	"/auth/kakao/callback",
	passport.authenticate("kakao", {
		failureRedirect: "/login",
		successRedirect: "/",
		failureFlash: "카카오 로그인에 실패하였습니다",
		successFlash: "환영합니다!",
	})
);

router.get(
	"/auth/kakao",
	passport.authenticate("kakao", {
		failureRedirect: "/login",
		successRedirect: "/",
		failureFlash: "카카오 로그인에 실패하였습니다",
		successFlash: "환영합니다!",
	})
);

router.get("/logout", checkAuthenticated, (req, res) => {
	req.logout();
	req.flash("success", "또 오세요~");
	res.redirect("/");
});

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		req.flash("failure", "로그인을 먼저 해주세요");
		res.redirect("/login");
	}
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		req.flash("failure", "로그인되어 있는 상태입니다");
		res.redirect("/");
	} else {
		next();
	}
}

module.exports = router;

exports.checkAuthenticated = checkAuthenticated;
exports.checkNotAuthenticated = checkNotAuthenticated;
