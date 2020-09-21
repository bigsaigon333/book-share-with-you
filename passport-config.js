const { Strategy: naverStrategy } = require("passport-naver");
const naverCallbackURL = "http://localhost:3000/auth/naver/callback";

function initialize(passport) {
	const authenticateUser = (accessToken, refreshToken, profile, done) => {
		// ToDo : validation id
		// process.nextTick(() => {
		// user = {
		// 	name: profile.displayName,
		// 	email: profile.emails[0].value,
		// 	username: profile.displayName,
		// 	provider: "naver",
		// 	naver: profile._json,
		// };
		console.log("user profile: " + profile);

		return done(null, profile);
		// });
	};

	passport.use(
		new naverStrategy(
			{
				clientID: process.env.NAVER_CLIENT_ID,
				ClientSecret: process.env.NAVER_CLIENT_SECRET,
				callbackURL: naverCallbackURL,
				svcType: 0,
			},
			authenticateUser
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser((obj, done) => {
		done(null, obj);
	});
}

module.exports = initialize;
