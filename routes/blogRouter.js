const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const authMiddleware = require("../middleware/checkLoggedInUser");
const isLoggedIn = authMiddleware.isLoggedIn;
const isBlogAuthor = authMiddleware.isBlogAuthor;

// ======= MIDDLEWARE ======= //

const checkBlogAuthor = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader.split(" ")[1];
		const object = jwt.verify(token, process.env.JWT_SECRET);
		res.locals.object = object;
		const blogId = req.params.blogId;

		Blog.findById(blogId)
			.then((foundBlog) => {
				if (foundBlog.user == object.user.id) {
					next();
				} else {
					res.json({ errorMessage: "unauthorized" });
				}
			})
			.catch((err) => {
				res.json({ errorMessage: "not found" });
			});
	} catch (err) {
		res.json({ errorMessage: err });
	}
};
// ======= MIDDLEWARE ======= //

// ======= ROUTES ======= //
router.post("/deleteBlog/:blogId");

// only update the blogs of the logged in user
router.patch("/updateBlog/:blogId", checkBlogAuthor, (req, res) => {
	const id = req.params.blogId;
	const title = req.body.newTitle;
	const body = req.body.newBody;

	if (!title) {
		res.status(400).json({ errorMessage: "title is required" });
	} else {
		Blog.findByIdAndUpdate(id, { title, body }, { new: true }).then(
			(updatedBlog) => {
				res.json({ updatedBlog });
			}
		);
	}
});
// ======= ROUTES ======= //
module.exports = router;
