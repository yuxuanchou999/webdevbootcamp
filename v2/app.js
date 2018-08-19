var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({entended: true}));
app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name:"Salmon Creek1",
//     image:"https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
//     description: "Beach camping"
// }, function(err, campground){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("New One!");
//         console.log(campground);
//     }
// });

// var campgrounds = [
//         {name:"Salmon Creek1", image:"https://pixabay.com/get/ec31b90f2af61c22d2524518b7444795ea76e5d004b014439df9c57aa1eeb1_340.jpg"},
//         {name:"Salmon Creek2", image:"https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104497f8c87da4ebb6bc_340.jpg"},
//         {name:"Salmon Creek3", image:"https://pixabay.com/get/ef3cb00b2af01c22d2524518b7444795ea76e5d004b014439df9c57aa1eeb1_340.jpg"}
//         ];
       
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


//SHOW - show info about the new one
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err,foundCampground){
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