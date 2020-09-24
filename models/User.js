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
		minlength: 5,
		maxlength: 255,
	},
	naverId: {
		type: Number,
	},
	kakaoId: {
		type: Number,
	},
	owns: [
		{
			type: mongoose.SchemaTypes.ObjectId,
			ref: "RegisteredBook",
		},
	],
	lends: [
		{
			type: mongoose.SchemaTypes.ObjectId,
			ref: "RegisteredBook",
		},
	],
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", userSchema);
