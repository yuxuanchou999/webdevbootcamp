var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var campground = [
    {
        name:"Dark Night",
        image: "https://pixabay.com/get/ec31b90f2af61c22d2524518b7444795ea76e5d004b014439cf5c871a4eeb3_340.jpg",
        description:"Camping in the Kullu District of Himachal Pradesh, India.Camping is an outdoor activity involving overnight stays away from home in a shelter, such as a tent. Generally participants leave developed areas to spend time outdoors in more natural ones in pursuit of activities providing them enjoyment. To be regarded as 'camping' a minimum of one night is spent outdoors, distinguishing it from day-tripping, picnicking, and other similarly short-term recreational activities. Camping can be enjoyed through all four seasons."
    },
    {
        name:"Starry Night",
        image: "https://pixabay.com/get/e83db50a21f4073ed1584d05fb1d4e97e07ee3d21cac104497f9c470afeeb6be_340.jpg",
        description:"Camping in the Kullu District of Himachal Pradesh, India.Camping is an outdoor activity involving overnight stays away from home in a shelter, such as a tent. Generally participants leave developed areas to spend time outdoors in more natural ones in pursuit of activities providing them enjoyment. To be regarded as 'camping' a minimum of one night is spent outdoors, distinguishing it from day-tripping, picnicking, and other similarly short-term recreational activities. Camping can be enjoyed through all four seasons."
    },
    {
        name:"Valley",
        image: "https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104497f9c470afeeb6be_340.jpg",
         description:"Camping in the Kullu District of Himachal Pradesh, India.Camping is an outdoor activity involving overnight stays away from home in a shelter, such as a tent. Generally participants leave developed areas to spend time outdoors in more natural ones in pursuit of activities providing them enjoyment. To be regarded as 'camping' a minimum of one night is spent outdoors, distinguishing it from day-tripping, picnicking, and other similarly short-term recreational activities. Camping can be enjoyed through all four seasons."
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
