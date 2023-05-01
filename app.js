// step: 1
const express = require("express");

// step: 2
const app = express();

// telling node js to use (ejs) as the view engine
app.set("view engine", "ejs");

// step: 4
app.get("/hello", function (req, res) {
	res.send("welcome to the JS");
});

app.get("/name", function (req, res) {
	res.send("Yarob");
});

// sending a regular html file
app.get("/testHtml", (req, res) => {
	res.sendFile(__dirname + "/test.html");
});

// rendering ejs file with simple variable
app.get("/testingEjs", (req, res) => {
	const course = "python";
	res.render("introToEjs.ejs", { name: course });
});

// rendering ejs file with array variable
app.get("/users", (req, res) => {
	const users = ["Ahmad", "kahled", "Yarob"];
	res.render("users.ejs", { users });
});

// rendering ejs file with array of objects variable
app.get("/usersObjects", (req, res) => {
	const usersObjects = [
		{ name: "Yarob", age: 20, id: 23 },
		{ name: "khaled", age: 20, id: 23 },
		{ name: "ahmad", age: 20, id: 23 },
	];
	res.render("usersObjects.ejs", { usersObjects });
});

// step: 3
app.listen(3000, function () {
	console.log("listening");
});

Yarob - Almostafa - W1 - 02 - HW;
