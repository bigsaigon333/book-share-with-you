const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
	book: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Book", bookSchema);
