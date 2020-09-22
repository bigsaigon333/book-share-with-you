const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		minlength: 5,
		maxlength: 255,
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

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", userSchema);
