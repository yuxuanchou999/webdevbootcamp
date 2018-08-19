var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX ROUTE - show all
router.get("/", function(req, res){
    // res.render("campgrounds", {campgrounds: campgrounds});
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
});

//CREATE ROUTE- add new one
router.post("/", isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name:name , image:image, description:desc, author:author};
    Campground.create(newCampground, function(err, newly){
        if(err){
            console.log(err);
        }else{
            console.log(newly);
            res.redirect("/campgrounds");
        }
    });
});

//NEW ROUTE - display form to make a new one
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});


//SHOW ROUTE - show info about the new one
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
             res.render("campgrounds/show",{campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground:foundCampground});
    });
});

// UPDATE ROUTE
router.put("/:id",checkCampgroundOwnership, function(req, res){
    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);  
        }
    });
});

// DESREOY ROUTE
router.delete("/:id",checkCampgroundOwnership,  function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds");
       }
   }); 
});



// middle ware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
    // is logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("back");
        }else{
            // does user own the campground
            if(foundCampground.author.id.equals(req.user._id)){
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

module.exports = router;