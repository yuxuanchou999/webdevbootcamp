// all middleware
var Sneaker = require("../models/sneaker");
var Rating = require("../models/rating");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkSneakerOwnership = function(req, res, next){
    // is logged in
    if(req.isAuthenticated()){
        Sneaker.findById(req.params.id, function(err, foundSneaker){
        if(err){
            req.flash("error", "Sneaker not found!")
            res.redirect("back");
        }else{
            // does user own the sneaker
            if(foundSneaker.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
            }else{
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        }
    });
    }else{
        req.flash("error", "You Need To Be Logged In First!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    // is logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            // does user own the comment
            if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
            }else{
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        }
    });
    }else{
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};

middlewareObj.checkRatingExists = function(req, res, next){
  Sneaker.findById(req.params.id).populate("ratings").exec(function(err, sneaker){
    if(err){
      console.log(err);
    }
    for(var i = 0; i < sneaker.ratings.length; i++ ) {
      if(sneaker.ratings[i].author.id.equals(req.user._id)) {
        req.flash("success", "You already rated this!");
        return res.redirect('/sneakers/' + sneaker._id);
      }
    }
    next();
  })
};


module.exports = middlewareObj;