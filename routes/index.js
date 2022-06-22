var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User     = require("../models/user");
var middleware = require("../middleware");

// Routes
router.get("/", function(req, res){
	res.render("landing");
});
//show the register form
router.get("/register",function(req,res){
	res.render("register");
});
//handle sign up logic
router.post("/register",function(req,res){
	var newUser = new User({username : req.body.username, profile: req.body.profile, firstName:req.body.firstName, lastname:req.body.lastname, profession:req.body.profession, aboutMe:req.body.aboutMe});
	User.register(newUser ,req.body.password,function(err,user){
		if(err){
			console.log("already signed up");
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
		res.redirect("/home");
		})
	})
})
//show login 
router.get("/login",function(req,res){
	res.render("login");
})
router.post("/login",passport.authenticate("local",{
	successRedirect:"/home",
	failureRedirect:"/login"
	}),function(req,res){
})

//logout route
router.get("/logout",function(req,res){
	req.logout();
	res.redirect("/home");
})

router.get("/aboutUs", function(req, res){
	res.render("aboutUs.ejs");
});

router.get("/contactUs", function(req, res){
	res.render("contactUs.ejs");
});

router.post("/contactUs", function(req, res){
	res.redirect("/home");
});

router.get("/help", function(req, res){
	res.render("help.ejs");
});

module.exports = router