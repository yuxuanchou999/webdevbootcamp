var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({entended: true}));
app.set("view engine", "ejs");
var campgrounds = [
        {name:"Salmon Creek1", image:"https://pixabay.com/get/ec31b90f2af61c22d2524518b7444795ea76e5d004b014439df9c57aa1eeb1_340.jpg"},
        {name:"Salmon Creek2", image:"https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104497f8c87da4ebb6bc_340.jpg"},
        {name:"Salmon Creek3", image:"https://pixabay.com/get/ef3cb00b2af01c22d2524518b7444795ea76e5d004b014439df9c57aa1eeb1_340.jpg"}
        ]
        
app.get("/", function(req, res){
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampgrounds = {name:name , image:image};
    campgrounds.push(newCampgrounds);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Started!");
})