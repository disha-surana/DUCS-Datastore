//Install frameworks
var express                 = require("express"),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    seedDb                  = require("./seed"),
    expressSanitizer        = require("express-sanitizer"),
    flash                   = require("connect-flash"),
    app                     = express();


    
//Require models
var User                    = require("./models/user"),
    Subject                 = require("./models/subject"),
    Post                    = require("./models/post"),
    Semester                = require("./models/semester");

//Require routes
var indexRoutes     = require("./routes/index"),
    semRoutes       = require("./routes/sem"),
    contentRoutes   = require("./routes/content");

app.use(flash());
app.use(bodyParser.json());
app.use(express.static("public"));          //Serve public directory
app.set("view engine", "ejs");              //Set ejs as default view engine
app.use(expressSanitizer());                //Used to remove script tags from content

app.use(require("express-session")({
    secret: "Any random sentence",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Essential mongoose commands
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


mongoose.connect("mongodb://localhost/PV12");  

app.use(bodyParser.urlencoded({extended:true}));    //To access form data

//=========================================
//To initialize db: seedDB
seedDb();
//=========================================

//To pass in every ejs by every single route the value of currentUser, this function will be called on every single route, whatever we put in res.locals is available inside our template , next function tells us to carry on move to actual next code 
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});




//To use routes/routefile.js
app.use(indexRoutes);
app.use(semRoutes);
app.use(contentRoutes);


//Code start listening server
app.listen(3000, function(){
    console.log("Server started listening");
});