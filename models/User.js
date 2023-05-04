//====== MODEL = TABLE (جدول)

// step 1: require mongoose
const mongoose = require("mongoose");

// step 2: get the schema
const Schema = mongoose.Schema;

// step 3: create an object out of this schema
const userSchema = new Schema(
	{
		fullName: String,
		id: String,
		phoneNumber: String,
		email: String,
		age: Number,
	},
	{
		timestamps: true,
	}
);

// step 4: create the model
const User = mongoose.model("User", userSchema);

// step 5: export the model
module.exports = User;
