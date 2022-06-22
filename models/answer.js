var mongoose = require("mongoose");

var aSchema = new mongoose.Schema({
	answer: String,
	author: {
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref : "User"
		},
		username : String
	},
	
	userProfile: String,
	date : 	{type: Date, default: Date.now},
	likes: [],
	likeCount: Number
	}
);

module.exports = mongoose.model("Answer", aSchema);