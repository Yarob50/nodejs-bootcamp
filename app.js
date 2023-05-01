// step: 1
const express = require("express");

// step: 2
const app = express();

// step: 4
app.get("/hello", function (req, res) {
	res.send("welcome to the JS bootcamp");
});

app.get("/name", function (req, res) {
	res.send("Yarob");
});

// step: 3
app.listen(8000, function () {
	console.log("listening");
});
