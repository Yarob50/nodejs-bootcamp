// BLOG MODEL

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, "you should fill the title"],
			unique: true,
		},
		body: String,
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
		},
		tags: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "tag",
			},
		],
	},
	{
		timestamps: true,
	}
);

const Blog = mongoose.model("blog", blogSchema);

module.exports = Blog;
