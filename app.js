var express         = require("express");
var bodyParser      = require("body-parser");
var methodOverride  = require("method-override");
var passport        = require("passport");
var	localStrategy   = require("passport-local");
var mongoose        = require('mongoose');
var Question 		= require("./models/question");
var Answer		    = require("./models/answer");
var User            = require("./models/user");
var app             = express();

//Routes
var answerRoutes     = require("./routes/answers"),
	questionRoutes  = require("./routes/questions"), 
	indexRoutes       = require("./routes/index"); 

var url = process.env.DATABASEURL || 'mongodb://localhost:27017/gafaq'

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
//Passport config
app.use(require("express-session")({
	secret : "Rusty is a cute dog!!!",
	resave : false,
	saveUninitialized : false 
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
})

app.use(indexRoutes);
app.use("/home",questionRoutes);
app.use("/home/:id/answers",answerRoutes);


var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("server has stated!!!");
});