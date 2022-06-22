//all the middle ware
var Question = require("../models/question");
var Answer	= require("../models/answer");
var middlewareObj = {};

middlewareObj.checkQuestionOwnership =function(req,res,next){
	if(req.isAuthenticated()){
		Question.findById(req.params.id,function(err,foundQuestion){
		if(err || !foundQuestion){
			res.redirect("back");
		}else{
			//does user own campground
			console.log(req.user);
			console.log(foundQuestion);
			if(foundQuestion.author.id.equals(req.user._id)){
				next();
			}else{
				res.redirect("back");
			}
		}
	});
	}else{
		res.redirect("back");
	}
}
middlewareObj.checkAnswerOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Answer.findById(req.params.answer_id,function(err,foundAnswer){
		if(err || !foundAnswer){
			res.redirect("back");
		}else{
			//does user own answer
			if(foundAnswer.author.id.equals(req.user._id)){
				next();
			}else{
				res.redirect("back");
			}
		}
	});
	}else{
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


module.exports = middlewareObj;