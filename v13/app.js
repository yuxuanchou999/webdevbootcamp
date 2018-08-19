var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment");
    
// requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundsRoutes = require("./routes/campgrounds"),
    ratingRoutes = require("./routes/ratings"),
    indexRoutes = require("./routes/index");
    
// seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v13");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//require moment
app.locals.moment = require('moment');


// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "once again Rusty wins",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    app.locals.error = req.flash("error");
    app.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/:id/ratings", ratingRoutes);
app.use("/campgrounds", campgroundsRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Started!");
})