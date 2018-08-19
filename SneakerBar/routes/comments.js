var express = require("express");
var router = express.Router({mergeParams: true});
var Sneaker = require("../models/sneaker");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ==========================
// COMMENTS ROUTE
// ==========================

router.get("/new", middleware.isLoggedIn, function(req, res){
    Sneaker.findById(req.params.id, function(err, foundSneaker){
        if(err){
            console.log(err);
        }else{
             res.render("comments/new", {sneaker: foundSneaker});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
   Sneaker.findById(req.params.id, function(err, sneaker){
       if(err){
           console.log(err);
           res.redirect("/sneakers");
       }else{
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   req.flash("error", "Something went wrong!")
                   console.log(err);
               }else{
                   // add username and  id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   console.log(comment);
                   sneaker.comments.push(comment);
                   sneaker.save();
                   req.flash("success", "Successfully added comment!");
                   res.redirect("/sneakers/" + sneaker._id);
               }
           });
       }
   });
});

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {sneaker_id: req.params.id, comment: foundComment});
        }
    });
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
             res.redirect("back");
        }else{
            res.redirect("/sneakers/" + req.params.id);
        }
       
    })
});

// DESTROY COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment deleted!");
            res.redirect("/sneakers/" + req.params.id);
        }
    });
});



module.exports = router;