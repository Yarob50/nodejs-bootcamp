const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./models/Blog");
const User = require("./models/User");
const bodyParser = require("body-parser");
const Profile = require("./models/Profile");

mongoose
	.connect(
		"mongodb+srv://yarob:yarob12334@cluster0.bdmavw2.mongodb.net/?retryWrites=true&w=majority"
	)
	.then(() => {
		console.log("connected");
	})
	.catch((err) => {
		console.log(err);
	});
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

///// CREATE A NEW BLOG
app.get("/createBlogForm", (req, res) => {
	res.render("createBlogForm.ejs");
});

app.get("/getSpecificUser", (req, res) => {
	User.findById("645b5113738cbf08366b4033")
		.populate("userProfile")
		.then((user) => {
			res.send(user);
		});
});

app.get("/createUserWithProfile", (req, res) => {
	Profile.findById("645b4ead3a72485fbdae27d5").then((profile) => {
		const user = new User({
			username: "yarob",
			email: "dsjfldjs@gmail.com",
			password: "dsjflsdjf",
			userProfile: profile._id,
		});

		user.save().then(() => {
			res.send(user);
		});
		// res.send(profile);
	});
});

// Example of one-to-one relation from both sides
app.get("/createProfileWithUser", (req, res) => {
	User.findById("645b4dac93614fe1d1dd0ce0").then((returnedUser) => {
		const newProfile = new Profile({
			bio: "djfldsjfls",
			workExperience: "sdjfldsjfldjsfd",
			connectedUser: returnedUser,
		});

		newProfile.save().then((savedProfile) => {
			returnedUser.userProfile = savedProfile._id;
			returnedUser.save().then(() => {
				res.send("completed");
			});
		});
		// res.send(user);
	});
});

// how to get the profile with the connected user populated
app.get("/getProfileWithUser", (req, res) => {
	Profile.findById("645b7540a073d5c9afc40ee2")
		.populate("connectedUser")
		.then((profile) => {
			res.send(profile);
		});
});

// Example of one-to-one relation from one side only (from user to the profile)
app.get("/createUserWithProfile", (req, res) => {
	Profile.findById("645b4ead3a72485fbdae27d5").then((profile) => {
		const user = new User({
			username: "yarob",
			email: "dsjfldjs@gmail.com",
			password: "dsjflsdjf",
			userProfile: profile._id,
		});

		user.save().then(() => {
			res.send(user);
		});
		// res.send(profile);
	});
});

app.get("/createProfile", (req, res) => {
	const profile = new Profile({
		bio: "dsjfldsjfdjsl",
		workExperience: "dsjfljdslfjsf",
	});

	profile.save().then(() => {
		res.send("saved");
	});
});

app.post("/createBlog", (req, res) => {
	const titleParam = req.body.titleInput;
	const bodyParam = req.body.bodyInput;

	const newBlog = new Blog({
		title: titleParam,
		body: bodyParam,
	});

	newBlog
		.save()
		.then(() => {
			res.redirect("/blogs");
		})
		.catch(() => {
			res.send("error");
		});
});

///// READ
app.get("/blogs", (req, res) => {
	Blog.find().then((blogs) => {
		res.render("blogs.ejs", { allBlogs: blogs });
	});
});

app.get("/blogs/:blogId", (req, res) => {
	const blogId = req.params.blogId;
	Blog.findById(blogId)
		.then((blog) => {
			res.render("blogDetails.ejs", { blog });
		})
		.catch(() => {
			res.send("error");
		});
});

////// DELETE
app.get("/deleteBlog/:blogId", (req, res) => {
	const blogId = req.params.blogId;
	Blog.findByIdAndDelete(blogId).then(() => {
		res.redirect("/blogs");
	});
});

////// UPDATE
app.get("/updateBlogForm/:blogId", (req, res) => {
	const blogId = req.params.blogId;
	Blog.findById(blogId).then((blog) => {
		res.render("editBlog.ejs", { blog: blog });
	});
	// Blog.findByIdAndUpdate(blogId, {
	//     title: "",
	//     body: ""
	// })
	// res.send(blogId);
	// res.render("editBlog.ejs");
});

app.get("/createUser", (req, res) => {
	const user = new User({
		username: "test",
		email: "test@gmail.com",
		password: "dsjlfdjsfldj",
	});

	user.save().then(() => {
		res.send("saved");
	});
});
app.post("/updateBlog/:blogId", (req, res) => {
	const blogId = req.params.blogId;
	const newTitle = req.body.titleInput;
	const newBody = req.body.bodyInput;

	Blog.findByIdAndUpdate(blogId, {
		title: newTitle,
		body: newBody,
	})
		.then(() => {
			res.redirect("/blogs");
		})
		.catch(() => {
			res.send("error");
		});
});

app.get("/", (req, res) => {
	const newBlog = new Blog({
		title: "my first blog",
		body: "this is the body of the blog",
	});
	newBlog
		.save()
		.then(() => {
			res.send("created");
		})
		.catch((err) => {
			res.send(err);
		});
});
app.listen(8888, () => {
	console.log("listening");
});
