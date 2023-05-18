const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./models/Blog");
const User = require("./models/User");
const bodyParser = require("body-parser");
const Profile = require("./models/Profile");
const Tag = require("./models/Tag");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// BCRYPT
const bcrypt = require("bcrypt");
const saltRounds = 10;

mongoose
	.connect(process.env.DB_URL)
	.then(() => {
		console.log("connected");
	})
	.catch((err) => {
		console.log(err);
	});
const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(cors());
app.use(
	session({
		secret: "my secret",
	})
);

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));

app.delete("/api", (req, res) => {
	res.json([
		{
			name: "Ahmad",
			age: 20,
			isStudent: false,
		},
		{
			name: "Ahmad",
			age: 20,
			isStudent: false,
		},
	]);
});

app.get("/allBlogs", (req, res) => {
	Blog.find().then((foundBlogs) => {
		res.status(200).json(foundBlogs);
	});
});

app.post("/createNewUser", (req, res) => {
	let username = req.body.enteredUsername;
	let email = req.body.enteredEmail;
	let password = req.body.enteredPassword;

	if (password) {
		const user = new User({
			username: username,
			email: email,
			password: password,
		});

		user.save().then((savedUser) => {
			res.json({ user: savedUser });
		});
	} else {
		res.status(400).json({ errorMessage: "password field is required" });
	}

	// res.send(username);
	// res.json({ username, email, password });
});

const isLoggedIn = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const token = authHeader.split(" ")[1];
		const object = jwt.verify(token, process.env.JWT_SECRET);
		res.locals.object = object;
		next();
	} catch (err) {
		res.json({ errorMessage: err });
	}
};
app.post("/api/createBlog", isLoggedIn, (req, res) => {
	// res.json(res.locals);
	// return;
	const object = res.locals.object;
	const passedTitle = req.body.titleInput;
	const passedBody = req.body.bodyInput;

	const blog = new Blog({
		title: passedTitle,
		body: passedBody,
		user: object.user.id,
	});

	blog.save()
		.then((createdBlog) => {
			createdBlog
				.populate("user")
				.then((blogWithPopulatedUser) => {
					res.json({ blog: blogWithPopulatedUser });
				})
				.catch((err) => {
					res.json({ err });
				});
		})
		.catch((err) => {
			res.json({ errorMessage: err.message });
		});
});

app.post("/api/registerUser", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;

	User.findOne({ username: username }).then((foundUser) => {
		if (foundUser) {
			res.status(400).json({ errorMessage: "username is already taken" });
		} else {
			bcrypt.hash(password, saltRounds).then((hashedPassword) => {
				const newUser = new User({
					username: username,
					email: email,
					password: hashedPassword,
				});

				newUser
					.save()
					.then((createdUser) => {
						// res.json(createdUser);
						// return;
						const token = jwt.sign(
							{
								user: {
									username: createdUser.username,
									id: createdUser._id,
								},
							},
							process.env.JWT_SECRET,
							{
								expiresIn: "1h",
							}
						);

						res.json({ token: token });
					})
					.catch((err) => {
						res.json({ error: err });
					});
			});
		}
	});
});

app.get("/envvars", (req, res) => {
	res.send(process.env.name);
});
app.get("/register", (req, res) => {
	let username = req.query.username;
	let password = req.query.password;
	let email = req.query.email;

	bcrypt.hash(password, saltRounds).then((encryptedPassword) => {
		User.create({
			username: username,
			email: email,
			password: encryptedPassword,
		}).then((createdUser) => {
			res.send("created successfully");
		});
	});
});

app.post("/api/login", (req, res) => {
	const username = req.body.userUsername;
	const password = req.body.userPassword;

	User.findOne({ username })
		.select("+password")
		.then((foundUser) => {
			if (!foundUser) {
				res.status(401).json({ errorMessage: "incorrect username" });
				return;
			}

			const encryptedPassword = foundUser.password;

			bcrypt
				.compare(password, encryptedPassword)
				.then((response) => {
					if (response == true) {
						const generatedToke = jwt.sign(
							{
								user: {
									username: foundUser.username,
									id: foundUser._id,
								},
							},
							process.env.JWT_SECRET,
							{
								expiresIn: "1h",
							}
						);

						res.json({ token: generatedToke });
					} else {
						res.status(401).json({
							errorMessage: "incorrect password",
						});
					}
				})
				.catch((err) => {
					res.json({ err: err });
				});
		})
		.catch((err) => {
			res.send(err);
		});
});

const checkLoggedInUser = (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader.split(" ")[1];
	try {
		jwt.verify(token, process.env.JWT_SECRET);
		next();
	} catch (err) {
		res.status(401).json({ err });
	}
};

app.post("/createPost/:postId", (req, res) => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const post = new Post();
	} catch (err) {
		res.status(401).json({ err });
	}
});
app.get("/api/secret", checkLoggedInUser, (req, res) => {
	res.json({ secret: "hello world" });
});

app.post("/api/createPost", checkLoggedInUser, (req, res) => {});

app.get("/login", (req, res) => {
	const username = req.query.username;
	const password = req.query.password;

	User.findOne({ username })
		.then((foundUser) => {
			if (!foundUser) {
				res.send("user not found");
				return;
			}

			const encryptedPassword = foundUser.password;

			bcrypt
				.compare(password, encryptedPassword)
				.then((response) => {
					if (response == true) {
						req.session.userId = foundUser._id;
						res.send(foundUser);
					} else {
						res.send("incorrect password");
					}
				})
				.catch((err) => {
					res.send(err);
				});
		})
		.catch((err) => {
			res.send(err);
		});
	// User.findOne({ username: username, password: password }).then(
	// 	(foundUser) => {
	// 		console.log("==========");
	// 		console.log(foundUser);
	// if (foundUser) {
	// req.session.currentuser = foundUser._id;
	// res.send(foundUser);
	// } else {
	// 	res.send("error");
	// }
	// 	}
	// );
});

app.get("/logout", (req, res) => {
	req.session.destroy();
	res.send("logged out");
});

app.get("/secret", (req, res) => {
	if (req.session.userId) {
		res.send("hello world");
	} else {
		res.send("not authorized");
	}
});

app.get("/secret2", (req, res) => {
	if (req.session.currentUser) {
		res.send("hello world2222");
	} else {
		res.send("not authorized");
	}
});

// SESSION
app.get("/session", (req, res) => {
	req.session.username = "Yarob";
	res.send(req.headers);
	// res.send(res.getHeaders());
});

app.get("/session2", (req, res) => {
	res.cookie("test", "hello");
	res.send(res.getHeaders());
});

app.listen(8888, () => {
	console.log("listening");
});
