var express  = require("express"),
    passport = require("passport"),
    User     = require("../models/user"),
    router   = express.Router();


//********AUTH ROUTES ***********//
//Basic home route which returns ejs file from views directory
router.get("/",function(req,res){
    res.render("landing");
});

router.get("/home", function(req,res){
    res.render("home");
});

// show register form
router.get("/register", function(req, res){
    res.render("register"); 
 });

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    if(req.body.adminCode == "harekrishna123"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            if(newUser.isAdmin){
                req.flash("success","Welcome to DUCS Datastore, "+ " Admin: " + req.user.username);
            }
            else{
                req.flash("success","Welcome to DUCS Datastore, "+ req.user.username);
            }
            res.redirect("/home"); 
        });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("login"); 
 });

 // handling login logic
 router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/home",
        failureRedirect: "/login",
        failureFlash: true, 
        successFlash: "Welcome to DUCS Datastore!" 
    }), function(req, res){
});

// logic route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/home");
 });
 
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
}
 
module.exports = router;