var express = require("express");
var router  = express.Router({mergeParams: true});
var Sneaker = require("../models/sneaker");
var Rating = require("../models/rating");
var middleware = require("../middleware");

router.post('/', middleware.isLoggedIn, middleware.checkRatingExists, function(req, res) {
	Sneaker.findById(req.params.id, function(err, sneaker) {
		if(err) {
			console.log(err);
		} else if (req.body.rating) {
				Rating.create(req.body.rating, function(err, rating) {
				  if(err) {
				    console.log(err);
				  }
				  rating.author.id = req.user._id;
				  rating.author.username = req.user.username;
				  rating.save();
					sneaker.ratings.push(rating);
					sneaker.save();
					req.flash("success", "Successfully added rating");
				});
		} else {
				req.flash("error", "Please select a rating");
		}
		res.redirect('/sneakers/' + sneaker._id);
	});
});

module.exports = router;