const express = require("express");

const parser = require("body-parser");

// step 1: by requiring mongoose
const mongoose = require("mongoose");

// step 2: connect to the database
mongoose
	.connect(
		"mongodb+srv://yarob:yarob1233@test.7p0vy71.mongodb.net/?retryWrites=true&w=majority"
	)
	.then(() => {
		console.log("=======***connection succeeded***=========");
	})
	.catch((error) => {
		console.log("=======***error***=========");
		console.log(error);
		console.log("=======***error***=========");
	});

// step 3: get the model
const User = require("./models/User");

const app = express();

app.use(parser.urlencoded({ extended: false }));

// app.use(bodyParser.urlencoded({ extended: false }));

// telling node js to use (ejs) as the view engine
app.set("view engine", "ejs");

// ======= DATABASE CRUD WITH UI ========

// CREATE A NEW USER
app.get("/createUserForm", (req, res) => {
	res.render("addUserForm");
});

app.post("/createUser", (req, res) => {
	const u = new User({
		fullName: req.body.username,
		phoneNumber: "324324324",
		email: "yarob@gmail.com",
		age: req.body.age,
	});

	u.save()
		.then(() => {
			res.send("user created succesfully");
		})
		.catch((e) => {
			res.send(e.message);
		});
});

// READ (ALL USERS)
app.get("/allUsers", (req, res) => {
	User.find().then((users) => {
		res.render("allUsers.ejs", { allUsers: users });
		// res.send(users);
	});
	// res.send("all users");
});

// SHOW USER DETAILS
app.get("/userDetails/:id", (req, res) => {
	const userId = req.params.id;

	User.findById(userId)
		.then((user) => {
			res.render("userDetails.ejs", { user: user });
		})
		.catch((error) => {
			res.send(error.message);
		});
});

// REMOVE USER
app.get("/removeUser/:id", (req, res) => {
	const userId = req.params.id;
	User.findByIdAndDelete(userId)
		.then(() => {
			res.redirect("/allUsers");
		})
		.catch(() => {
			res.send("error");
		});
});

// ====== UPDATE WITH CREATE IN THE SAME FORM =====
// EDIT (UPDATE) USER
app.get("/editUser/:id", (req, res) => {
	const userId = req.params.id;
	User.findById(userId).then((user) => {
		res.render("addUserForm", { user: user });
	});
});

app.post("/updateCurrentUser/:id", (req, res) => {
	const userId = req.params.id;
	res.send(userId);
});
// ======// UPDATE WITH CREATE IN THE SAME FORM //=====

///====== UPDATE & CREATE IN SEPARATE FORMS =======
app.get("/separateEditUser/:userId", (req, res) => {
	const userId = req.params.userId;
	User.findById(userId)
		.then((returnedUser) => {
			res.render("updateUserForm.ejs", { u: returnedUser });
		})
		.catch((err) => {
			res.send(err.message);
		});
});

app.post("/separateUpdateUser/:updatedUserId", (req, res) => {
	const id = req.params.updatedUserId;
	User.findById(id).then((foundUser) => {
		const name = req.body.newName;
		foundUser.fullName = name;
		foundUser.save().then(() => {
			res.redirect("/allUsers");
		});
	});
});
///======// UPDATE & CREATE IN SEPARATE FORMS //=======

// step: 3
app.listen(process.env.port || 8800, function () {
	console.log("listening");
});

// Yarob - Almostafa - W1 - 02 - HW;

// <Yarob - Almostafa> - W1 - 03 - LAB_1;
