var express = require("express");
var router = express.Router();
var Sneaker = require("../models/sneaker");
var middleware = require("../middleware");

//INDEX ROUTE - show all
router.get("/", function(req, res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Sneaker.find({name:regex}, function(err, allSneakers){
            if (err) {
                console.log(err);
            } else {
                if (allSneakers.length === 0) {
                    req.flash('error', 'Sorry, no sneakers match your query. Please try again');
                    return res.redirect('/sneakers');
                }
                res.render('sneakers/index', {sneakers: allSneakers,
                                                 page: 'sneakers' });
            }
        });
    }else{
        // res.render("sneakers", {sneakers: sneakers});
        Sneaker.find({}, function(err, allSneakers){
            if(err){
                console.log(err);
            }else{
                res.render("sneakers/index", {sneakers:allSneakers});
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
    var newSneaker = {name:name , price: price, image:image, description:desc, author:author};
    Sneaker.create(newSneaker, function(err, newly){
        if(err){
            console.log(err);
        }else{
            console.log(newly);
            res.redirect("/sneakers");
        }
    });
});

//NEW ROUTE - display form to make a new one
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("sneakers/new");
});


//SHOW ROUTE - show info about the new one
// SHOW - shows more info about one sneaker
router.get("/:id", function(req, res){
    //find the sneaker with provided ID
    Sneaker.findById(req.params.id).populate("comments").populate("ratings").exec(function(err, foundSneaker){
        if(err){
            console.log(err);
        } else {
            if(foundSneaker.ratings.length > 0) {
              var ratings = [];
              var length = foundSneaker.ratings.length;
              foundSneaker.ratings.forEach(function(rating) { 
                ratings.push(rating.rating) 
              });
              var rating = ratings.reduce(function(total, element) {
                return total + element;
              });
              foundSneaker.rating = rating / length;
              foundSneaker.save();
            }
            console.log("Ratings:", foundSneaker.ratings);
            console.log("Rating:", foundSneaker.rating);
            //render show template with that sneaker
            res.render("sneakers/show", {sneaker: foundSneaker});
        }
    });
});


// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkSneakerOwnership, function(req, res){
    Sneaker.findById(req.params.id, function(err, foundSneaker){
        res.render("sneakers/edit", {sneaker:foundSneaker});
    });
});

// UPDATE ROUTE
router.put("/:id", middleware.checkSneakerOwnership, function(req, res){
    
    Sneaker.findByIdAndUpdate(req.params.id, req.body.sneaker, function(err, updatedSneaker){
        if(err){
            res.redirect("/sneakers");
        }else{
            res.redirect("/sneakers/" + req.params.id);  
        }
    });
});

// DESREOY ROUTE
router.delete("/:id", middleware.checkSneakerOwnership,  function(req, res){
   Sneaker.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/sneakers");
       }else{
           res.redirect("/sneakers");
       }
   }); 
});

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;