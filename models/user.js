var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username : String,
	password : String,
	profile: String,
	firstName: String,
	Lastname: String,
	profession: String,
	aboutMe: String,
	questions:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Question"
		}
	]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);