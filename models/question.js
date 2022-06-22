var mongoose = require("mongoose");

var qSchema = new mongoose.Schema({
	question: String,
	author:{
	   id : {
			type : mongoose.Schema.Types.ObjectId,
			ref : "User"
		},
		username : String
   },
	answers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Answer"
		}
	],
	tags: String,
	date : 	{type: Date, default: Date.now},
	userProfile: String

});

module.exports = mongoose.model("Question", qSchema);