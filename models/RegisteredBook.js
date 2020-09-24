const mongoose = require("mongoose");

const registeredBookSchema = new mongoose.Schema({
	introducingComment: String,
	sharePlace: {
		type: String,
		required: true,
	},
	status: {
		type: ["available", "lended"],
		default: "available",
		required: true,
	},
	owner: {
		type: mongoose.SchemaTypes.ObjectId,
		required: true,
		ref: "User",
	},
	isbn: {
		type: String,
		required: true,
	},
	info: {
		type: mongoose.SchemaTypes.ObjectId,
		required: true,
		ref: "BookInfo",
	},

	registeredAt: {
		type: Date,
		required: true,
		default: new Date().toLocaleString(),
	},
});

module.exports = mongoose.model("RegisteredBook", registeredBookSchema);
