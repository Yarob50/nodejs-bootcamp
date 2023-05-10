const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema(
	{
		title: String,
		body: String,
	},
	{
		timestamps: true,
	}
);

const Blog = mongoose.model("blog", blogSchema);

module.exports = Blog;
