const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		// minlength: 5,
		// maxlength: 50,
		unique: true,
	},
	email: {
		type: String,
		// required: true,
		unique: true,
		minlength: 5,
		maxlength: 255,
	},
	naverId: {
		type: Number,
		unique: true,
	},
	kakaoId: {
		type: Number,
		unique: true,
	},
	owns: [
		{
			book: {
				type: mongoose.SchemaTypes.ObjectId,
			},
		},
	],
	lends: [
		{
			book: {
				type: mongoose.SchemaTypes.ObjectId,
			},
		},
	],
});

userSchema.plugin(passportLocalMongoose, { usernameField: "username" });

module.exports = mongoose.model("User", userSchema);
