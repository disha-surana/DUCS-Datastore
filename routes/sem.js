var express  = require("express"),
    router   = express.Router(),
    Subject  = require("../models/subject"),
    Post     = require("../models/post"),
    Semester = require("../models/semester");

//********SEM ROUTES ***********//
router.get("/sem/:no", isLoggedIn,function(req,res){
    Semester.findOne({sem: req.params.no}, function(err, semOb){
        if(err){
            req.flash("error","Semester not found!");  //won't occur
            res.redirect("/home");
        }
        else{
            //Find all subjects of the selected sem
            Subject.find().where('_id').in(semOb.subjects).exec((err, subjects) => {
                if(!err){
                    res.render("sem",{subjects: subjects, sem:semOb.sem});
                }
            });
        }
    });
});


// middle ware function
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next(); //move to next function in parameters where this func is called
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
}
 
module.exports = router;