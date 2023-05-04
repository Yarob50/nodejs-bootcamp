const express = require("express");

// step 1: by requiring mongoose
const mongoose = require("mongoose");

// step 2: connect to the database
mongoose
	.connect(
		"mongodb+srv://admin:admin112233@cluster0.23wtpqw.mongodb.net/?retryWrites=true&w=majority"
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
		age: "20edsfds",
	});

	// save the object created
	u.save()
		.then(() => {
			res.send("record created in the DB");
		})
		.catch((error) => {
			if (error.errors.hasOwnProperty("age")) {
				res.send("error in the age input");
			} else {
				res.send(error.message);
			}
		});
});

// step: 3
app.listen(8800, function () {
	console.log("listening");
});

// Yarob - Almostafa - W1 - 02 - HW;

// <Yarob - Almostafa> - W1 - 03 - LAB_1;
