// step: 1
const express = require("express");

const bodyParser = require("body-parser");

// step: 2
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// telling node js to use (ejs) as the view engine
app.set("view engine", "ejs");

// app.use(bodyParser.urlencoded());
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
	res.send("get request");
	res.send(req.query);
	const users = ["Ahmad", "kahled", "Yarob"];
	res.render("users.ejs", { users });
});

app.get("/users/:id", (req, res) => {
	res.send(req.params.id);
	res.send("this is the user id route");
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

app.put("/users", (req, res) => {
	res.json({ text: "put request" });
});

app.post("/users", (req, res) => {
	res.send("post request");
	// console.log(req.body);
	// res.send(req.query);
});

app.get("/form", (req, res) => {
	res.render("form.ejs");
});
// step: 3
app.listen(3300, function () {
	console.log("listening");
});

// Yarob - Almostafa - W1 - 02 - HW;

// <Yarob - Almostafa> - W1 - 03 - LAB_1;
