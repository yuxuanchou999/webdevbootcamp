var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX ROUTE - show all
router.get("/", function(req, res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name:regex}, function(err, allCampgrounds){
            if (err) {
                console.log(err);
            } else {
                if (allCampgrounds.length === 0) {
                    req.flash('error', 'Sorry, no campgrounds match your query. Please try again');
                    return res.redirect('/campgrounds');
                }
                res.render('campgrounds/index', {campgrounds: allCampgrounds,
                                                 page: 'campgrounds' });
            }
        });
    }else{
        // res.render("campgrounds", {campgrounds: campgrounds});
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            }else{
                res.render("campgrounds/index", {campgrounds:allCampgrounds});
            }
        });
    }

});

//CREATE ROUTE- add new one
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name:name , price: price, image:image, description:desc, author:author};
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
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});


//SHOW ROUTE - show info about the new one
// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").populate("ratings").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            if(foundCampground.ratings.length > 0) {
              var ratings = [];
              var length = foundCampground.ratings.length;
              foundCampground.ratings.forEach(function(rating) { 
                ratings.push(rating.rating) 
              });
              var rating = ratings.reduce(function(total, element) {
                return total + element;
              });
              foundCampground.rating = rating / length;
              foundCampground.save();
            }
            console.log("Ratings:", foundCampground.ratings);
            console.log("Rating:", foundCampground.rating);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground:foundCampground});
    });
});

// UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);  
        }
    });
});

// DESREOY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership,  function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds");
       }
   }); 
});

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;