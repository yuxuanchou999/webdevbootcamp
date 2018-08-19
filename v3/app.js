var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds");
    
seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v3");
app.use(bodyParser.urlencoded({entended: true}));
app.set("view engine", "ejs");



app.get("/", function(req, res){
   res.render("landing"); 
});

//INDEX ROUTE - show all
app.get("/campgrounds", function(req, res){
    // res.render("campgrounds", {campgrounds: campgrounds});
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("index", {campgrounds:allCampgrounds});
        }
    })
});

//CREATE ROUTE- add new one
app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name:name , image:image, description:desc};
    Campground.create(newCampground, function(err, newly){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
});

//NEW ROUTE - display form to make a new one
app.get("/campgrounds/new", function(req, res){
    res.render("new");
});


//SHOW ROUTE - show info about the new one
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
             res.render("show",{campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Started!");
})