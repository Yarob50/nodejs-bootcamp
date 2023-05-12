// TAG MODEL
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TagSchema = new Schema({
	name: String,
	description: String,
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "blog",
		},
	],
});

const Tag = mongoose.model("tag", TagSchema);

module.exports = Tag;
