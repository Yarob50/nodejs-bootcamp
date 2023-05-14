const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./models/Blog");
const User = require("./models/User");
const bodyParser = require("body-parser");
const Profile = require("./models/Profile");
const Tag = require("./models/Tag");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// BCRYPT
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

app.use(
	session({
		secret: "my secret",
	})
);

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));

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
