const { Strategy: naverStrategy } = require("passport-naver");
const { Strategy: kakaoStrategy } = require("passport-kakao");
const { Strategy: localStrategy } = require("passport-local");
const User = require("./models/User");
const naverCallbackURL = process.env.DOMAIN + "/auth/naver/callback";
const kakaoCallbackURL = process.env.DOMAIN + "/auth/kakao/callback";

function initialize(passport) {
	const verifyUser = async (accessToken, refreshToken, profile, done) => {
		console.log(profile);

		// build user information
		const { provider, id, displayName: username } = profile;

		const keyId = provider + "Id";
		const user = {};

		if (provider === "naver") user.naverId = id;
		else if (provider === "kakao") user.kakaoId = id;

		try {
			const registeredUser = await User.findOne(user);

			if (registeredUser) return done(null, registeredUser);

			user.username = username;
			const newUser = await User.create(user);
			return done(null, newUser);
		} catch (error) {
			console.error(error);
			return done(error);
		}
	};

	// Naver Login Strategy
	passport.use(
		new naverStrategy(
			{
				clientID: process.env.NAVER_CLIENT_ID,
				clientSecret: process.env.NAVER_CLIENT_SECRET,
				callbackURL: naverCallbackURL,
				svcType: 0,
			},
			verifyUser
		)
	);

	// Kakao Login Strategy
	passport.use(
		new kakaoStrategy(
			{
				clientID: process.env.KAKAO_REST_API_KEY,
				// clientSecret: "",    // KAKAO는 clientSecret을 필요로 하지 않는다
				callbackURL: kakaoCallbackURL,
			},
			verifyUser
		)
	);

	// local Login Strategy
	passport.use(User.createStrategy());

	passport.serializeUser((user, done) => {
		if (user.email) done(null, { provider: "local", id: user.email });
		if (user.naverId) done(null, { provider: "naver", id: user.naverId });
		if (user.kakaoId) done(null, { provider: "kakao", id: user.kakaoId });
	});

	passport.deserializeUser(async (obj, done) => {
		const { provider, id } = obj;
		let user;
		try {
			if (provider === "local") user = await User.findOne({ email: id });
			else if (provider === "naver") user = await User.findOne({ naverId: id });
			else if (provider === "kakao") user = await User.findOne({ kakaoId: id });

			return done(null, user);
		} catch (error) {
			console.error(error);
			return done(error);
		}
	});
}

module.exports = initialize;
