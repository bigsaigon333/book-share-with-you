const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
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

module.exports = mongoose.model("User", userSchema);
