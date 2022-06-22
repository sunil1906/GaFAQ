var express = require("express");
var router  = express.Router();
var Question = require("../models/question");
var User     = require("../models/user");
var middleware = require("../middleware");
var Answer	= require("../models/answer");

router.get("/", function(req, res){
	Question.find({}, function(err, allquestions){
		if(err){
			console.log(err);
		} else{
			User.find({}, function(err, allusers){
				if(err){
					console.log(err);
				} else{
					Answer.find({}, function(err, allanswers){
						if(err){
							console.log(err);
						} else{
							res.render("questions/home" ,{questions : allquestions, users: allusers, answers: allanswers});
						}
					});
				}
			});
			
		}
	});
	
});

router.get("/new",middleware.isLoggedIn, function(req, res){
	res.render("questions/new");
});

router.post("/",middleware.isLoggedIn, function(req, res){
	Question.create(req.body.question, function(err, newlyCreatedQuestion){
		if(err){
			console.log(err);
		} else{
			User.findById(req.user._id, function(err, userFound){
				newlyCreatedQuestion.author.id=req.user._id;
				newlyCreatedQuestion.author.username=req.user.username;
				newlyCreatedQuestion.userProfile = userFound.profile;
				newlyCreatedQuestion.save();
				userFound.questions.push(newlyCreatedQuestion);
				userFound.save();
				res.redirect("/home");
			});
		}
	});
});

router.get("/:id", function(req, res){
	Question.findById(req.params.id).populate("answers").exec(function(err, question){
		if(err){
			console.log(err);
		} else {
		
			res.render("questions/show", {question : question});
		}
	});
});

router.get("/user/:id", function(req, res){
	User.findById(req.params.id).populate("questions").exec( function(err, userFound){
		if(err){
			console.log(err);
		} else{
			
			res.render("users/show", {user: userFound});
		}
	});
});

router.get("/:id/edit",middleware.checkQuestionOwnership, function(req, res){
	Question.findById(req.params.id, function(err, question){
			res.render("questions/edit", {question : question});
	});		
});

router.put("/:id",middleware.checkQuestionOwnership,  function(req, res){
	Question.findByIdAndUpdate(req.params.id, req.body.question, function(err, updatedQuestion){
		if(err){
			console.log(err);
		} else{
			res.redirect("/home/" + req.params.id);
		}
	});
});

router.delete("/:id",middleware.checkQuestionOwnership,  function(req, res){
	Question.findById(req.params.id, function(err, foundQuestion){
		if(err){
			console.log(err);
		}  else{
			for(var i=0;i<foundQuestion.answers.length;i++){
				Answer.findByIdAndRemove(foundQuestion.answers[i], function(){});
			}
		}
	});
	Question.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/home");
		}
	})
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router