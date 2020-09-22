const { Strategy: naverStrategy } = require("passport-naver");
const { Strategy: kakaoStrategy } = require("passport-kakao");
const { Strategy: localStrategy } = require("passport-local");
const User = require("./models/User");
const naverCallbackURL = process.env.DOMAIN + "/auth/naver/callback";
const kakaoCallbackURL = process.env.DOMAIN + "/auth/kakao/callback";

function initialize(passport) {
	const verifyUser = (accessToken, refreshToken, profile, done) => {
		// ToDo : validation id
		// process.nextTick(() => {
		// user = {
		// 	name: profile.displayName,
		// 	email: profile.emails[0].value,
		// 	username: profile.displayName,
		// 	provider: "naver",
		// 	naver: profile._json,
		// };
		console.log("user profile: ");
		console.log(profile);

		return done(null, profile);
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
		done(null, user);
	});

	passport.deserializeUser((obj, done) => {
		done(null, obj);
	});
}

module.exports = initialize;
