const mongoose = require("mongoose");

const bookInfoSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	image: {
		type: String,
	},
	author: {
		type: String,
		required: true,
	},
	publisher: {
		type: String,
		required: true,
	},
	pubdate: {
		type: String,
		required: true,
	},
	isbn: {
		type: String,
		required: true,
		unique: true,
	},
});

module.exports = mongoose.model("BookInfo", bookInfoSchema);
