var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var campground = [
    {
        name:"Dark Night",
        image: "https://pixabay.com/get/ec31b90f2af61c22d2524518b7444795ea76e5d004b014439cf5c871a4eeb3_340.jpg",
        description:"sdjhakgla"
    },
    {
        name:"Starry Night",
        image: "https://pixabay.com/get/e83db50a21f4073ed1584d05fb1d4e97e07ee3d21cac104497f9c470afeeb6be_340.jpg",
        description:"afaglfi"
    },
    {
        name:"Valley",
        image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104497f9c470afeeb6be_340.jpg",
        description:"akfalfakbf"
    }
    ]

function seedDB(){
    //Remove all campgrounds
    Campground.remove({}, function(err){
    if(err){
        console.log(err);
    }
    console.log("removed campgrounds");
    // add a few campgrounds
    campground.forEach(function(seed){
       Campground.create(seed, function(err, campground){
           if(err){
               console.log(err);
           }else{
               console.log("added one");
               //create a comment
              Comment.create({
                  text: "This is a fantastic place!",
                  author: "zyx"
              }, function(err, comment){
                  if(err){
                      console.log(err);
                  }else{
                      campground.comments.push(comment);
                      campground.save();
                      console.log("Created new comment");
                  }
              });
          }
      }); 
    });
 });
    
}

module.exports = seedDB;
