var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Sneaker = require("../models/sneaker");


router.get("/", function(req, res){
   res.render("landing"); 
});

//================
// Auth Routes
//================

// show register form
router.get("/register", function(req, res){
    res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User(
        {
            username: req.body.username, 
            firstName: req.body.firstName, 
            lastName: req.body.lastName,
            email: req.body.email,
            avatar: req.body.avatar
        });
    if(req.body.adminCode === "adminCode"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp, " + user.username);
            res.redirect("/sneakers");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// handle login logic
router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/sneakers",
    failureRedirect: "/login"
}), function(req, res) {
});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/sneakers");
});


// users profiles
router.get("/users/:id", function(req, res){
   User.findById(req.params.id, function(err, foundUser){
       if(err){
           req.flash("error", "Something went wrong.");
           req.redirect("/");
       }
       Sneaker.find().where("author.id").equals(foundUser._id).exec(function(err, sneakers){
           if(err){
               req.flash("error", "Something went wrong.");
               req.redirect("/");
           }
           res.render("users/show",{user: foundUser, sneakers:sneakers});
       });
   }); 
});

module.exports = router;