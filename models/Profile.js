const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
	bio: String,
	workExperience: String,
	connectedUser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
});

const Profile = mongoose.model("profile", profileSchema);

module.exports = Profile;
