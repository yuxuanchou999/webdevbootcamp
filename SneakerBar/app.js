var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Sneaker = require("./models/sneaker"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment");
    
// requiring routes
var commentRoutes = require("./routes/comments"),
    sneakersRoutes = require("./routes/sneakers"),
    ratingRoutes = require("./routes/ratings"),
    indexRoutes = require("./routes/index");
    
// seedDB();
// mongoose.connect("mongodb://localhost/sneakerBar");
mongoose.connect("mongodb://zyx:zyx87224240@ds125912.mlab.com:25912/sneaker_bar");
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
app.use("/sneakers/:id/comments", commentRoutes);
app.use("/sneakers/:id/ratings", ratingRoutes);
app.use("/sneakers", sneakersRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SneakerBar Started!");
})