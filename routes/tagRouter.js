const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/checkLoggedInUser");
router.post("/createTag", isLoggedIn, (req, res) => {
	const tagName = req.body.tagName;

	Tag.create({
		name: tagName,
	}).then((createdTag) => {
		res.json({ createdTag });
	});
});

module.exports = router;

router.get("/", book_controller.index);

book_controller.index = (req, res, nex) => {};
