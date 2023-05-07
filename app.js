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

// app.use(bodyParser.urlencoded());
// step: 4
app.get("/hello", function (req, res) {
	res.send("welcome to the JS");
});

// step 4: communicate with the database using the model
app.get("/createUser", (req, res) => {
	// 4.1 create an object from the model by passing the data into the columns
	const u = new User({
		fullName: "Ahmad",
		id: "43242343",
		phoneNumber: "536343534",
		email: "ahamd@gmail.com",
		age: "20",
	});

	// save the object created

	u.save()
		.then(() => {
			res.send("record created in the DB");
		})
		.catch((error) => {
			res.send(error);
			// if (error.errors.hasOwnProperty("age")) {
			// 	res.send("error in the age input");
			// } else {
			// 	res.send(error.message);
			// }
		});
});

app.get("/createUserForm", (req, res) => {
	res.render("addUserForm");
});

// ======= CRUD ========

// CREATE
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

// READ A SPECIFIC USER
app.get("/getSpecificUser/:userId", (req, res) => {
	const userId = req.params.userId;
	User.findById(userId)
		.then((user) => {
			res.send(user);
		})
		.catch((err) => {
			res.send(err.message);
		});
});

// DELETE A SPECIFIC USER
app.get("/deleteUser/:userId", (req, res) => {
	const userId = req.params.userId;
	// User.findById(userId)
	// 	.then((user) => {
	// 		user.remove().exec();
	// 		res.send("removed");
	// 	})
	// 	.catch((err) => {
	// 		res.send(err.message);
	// 	});

	User.deleteOne({ _id: userId })
		.then(() => {
			res.send("completed");
		})
		.catch((err) => {
			res.send(err.message);
		});
});

// UPDATE
app.get("/updateUser/:userId", (req, res) => {
	const newFullName = req.query.fullName;
	User.findById(req.params.userId).then((user) => {
		user.fullName = newFullName;
		user.save().then(() => {
			res.send("updated");
		});
	});
});

// step: 3
app.listen(8800, function () {
	console.log("listening");
});

// Yarob - Almostafa - W1 - 02 - HW;

// <Yarob - Almostafa> - W1 - 03 - LAB_1;
