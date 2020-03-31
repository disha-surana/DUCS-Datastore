var express             = require("express"),
    router              = express.Router(),
    Subject             = require("../models/subject"),
    expressSanitizer    = require("express-sanitizer"),
    Post                = require("../models/post"),
    mongoose            = require('mongoose'), 
    multer              = require('multer'),
    GridFsStorage       = require('multer-gridfs-storage'),
    Grid                = require('gridfs-stream'),
    methodOverride      = require('method-override');

//require dotenv
//require('dotenv/config');

var databaseUrl = process.env.MONGOOSE_URL || "mongodb://localhost/ducsdatastore"


const conn = mongoose.createConnection(databaseUrl, {
useNewUrlParser: true,
useUnifiedTopology: true
});
let gfs;  //initialize variable for gridFsStream

conn.once('open', function(){
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
    url: databaseUrl,
    file: function(req, file){
        const filename=file.originalname;
        const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
        };
        return fileInfo;
    }
});

const upload = multer({ storage });    

//instead of making separate route for each subject we can create sem/:no/:subject route and when each subject is click 1 ejs file is created for subjectInfo ..

//For a page where we want to push some data 3 routes needed : 1 get for page, 1 get for form page to upload data, 1 post to push data to 1st get page
//VIEW

var gfs_file_find = function(send, post){
    return new Promise(function(resolve, reject){
        gfs.files.find({ '_id': { $in: post.files } }).toArray( function(err, files) {
            if (err) {
                console.log("Error: gfs " + error);  
                resolve(send); 
            }
            else {
                if (!files) { 
                    resolve(send); 
                }
                else {
                    var obj = {};
                    obj.id=post._id;
                    obj.title = post.title;
                    obj.content = post.content;
                    obj.postdate = post.postdate.toUTCString() ;
                    obj.author = {
                        id: post.author.id,
                        name: post.author.name
                    }
                    obj.files = files;
                    send.push(obj);
                    resolve(send);
                }
            }
        });
    });
}


//To show subject page and all its posts and all files of each post grouped together
router.get("/sem/:no/:subj", isLoggedIn,function(req,res){
    Subject.findOne({code:req.params.subj}, function(err, foundSubject){
        if(err){
            req.flash("error","Subject not found!");  //won't occur
            res.redirect("/sem/"+req.params.no);
        }
        else{
            var send = [];
            Post.find({'_id': {$in: foundSubject.posts}}, async function(err, posts)
            {
                if(err){
                    req.flash("error","Oops! Something went wrong try again later.");  //won't occur
                    res.redirect("/home");
                } 
                else 
                {
                    if(posts.length == 0){
                        res.render("subject",{posts:send, subject:foundSubject, sem_no:req.params.no});
                    }
                    for(var i=posts.length-1 ; i >=0 ;i--)
                    {
                        send = await gfs_file_find(send, posts[i]);
                        if(i == 0){
                            res.render("subject",{posts:send, subject:foundSubject, sem_no:req.params.no});
                        }
                    }
                }
            });
        }
    });
});


//PUSH post
const arrUpload = upload.array('file', 12);  //limit is 12
router.post("/sem/:no/:subj", isLoggedIn, arrUpload, function(req,res){
   req.body.info=req.sanitize(req.body.info); 
   Subject.findOne({"code": req.params.subj}, function(err, subject){
        if(err){
            req.flash("error","Subject not found!");  //won't occur
            res.redirect("/home");
        } else 
        {
            var post = new Post({
                title: req.body.topic,
                content: req.body.desc,
                author:{
                    id : req.user._id,
                    name: req.user.username
                }
            });
            req.files.forEach(function(file){
                post.files.push(file.id);
            });
            
            Post.create(post, function(err, post){
                if(err){
                    req.flash("error","Oops! Something went wrong try again later.");  //won't occur
                    res.redirect("/sem/"+req.params.no+"/"+req.params.subj);
                } else {
                    subject.posts.push(post);
                    subject.save();
                    req.flash("success","Successfully added post.");  
                    res.redirect("/sem/"+req.params.no+"/"+req.params.subj);
                } 
            });
            
        }
    });
});   

//UPLOAD post form
router.get("/sem/:no/:subj/addContent", isLoggedIn,function(req,res){
    Subject.findOne({code: req.params.subj}, function(err, subject){
        if(err){
            req.flash("error","Subject not found!");  //won't occur
            res.render("/home");
        }
        else{
            res.render("uploadForm",{sem_no:req.params.no, subject:subject})
        }
    }); 
});


//DELETE POST
router.post('/deletepost/:no/:subj/:postid', isLoggedIn, function(req, res){
    
    Post.findOne({_id : req.params.postid}, function (err, post) {
        if(err){
            res.redirect("/sem/"+req.params.no+"/"+req.params.subj);
        }
        else{
            if(post.author.name == req.user.username || req.user.isAdmin){
                var filesToBeDel = post.files;

                if(filesToBeDel.length==0){
                    Post.remove({ _id: req.params.postid }, (err) => {
                        if (err) {
                          return res.status(404).json({ err: err });
                        }
                        else{
                            Subject.findOne({'code':req.params.subj}, function(err, subject) {
                                if(err){
                                    req.flash("error","Subject not found!");  //won't occur
                                    res.redirect("/sem/"+req.params.no+"/"+req.params.subj);
                                }
                                else{
                                    for(var i = subject.posts.length - 1; i >= 0; i--) {
                                        if(subject.posts[i] == req.params.postid) {
                                            subject.posts.splice(i, 1);
                                            subject.save(); 
                                            req.flash("success","Successfully deleted post!");
                                            res.redirect("/sem/"+req.params.no+"/"+req.params.subj);
                                        }
                                    }
                                }
                            })
                        }
                    });
                }

                var file_ids = [];

                for(var i=0; i<filesToBeDel.length; i++){

                    file_ids.push(new mongoose.mongo.ObjectId(filesToBeDel[i]));

                    if(i == filesToBeDel.length-1){
                        Post.remove({ _id: req.params.postid }, (err) => {
                            if (err) {
                              return res.status(404).json({ err: err });
                            }
                            else{                            
                                gfs.remove({_id : file_ids, root: 'uploads'}, function (err, gridStore) {
                                    if (err) console.log(err); //gfs error
                                    else{
                                        Subject.findOne({'code':req.params.subj}, function(err, subject) {
                                            if(err){
                                                req.flash("error","Subject not found!");  //won't occur
                                                res.redirect("/sem/"+req.params.no+"/"+req.params.subj);
                                            }
                                            else{
                                                for(var i = subject.posts.length - 1; i >= 0; i--) {
                                                    if(subject.posts[i] == req.params.postid) {
                                                        subject.posts.splice(i, 1);
                                                        subject.save(); 
                                                        req.flash("success","Successfully deleted post!");  
                                                        res.redirect("/sem/"+req.params.no+"/"+req.params.subj);
                                                    }
                                                }
                                            }
                                        })
                                    }
                                }); 
                            }
                        });
                    }
                }
            }
            else{
                req.flash("error","You don't have permission to do that");  //When non-author tries to delete
                res.redirect("/sem/"+req.params.no+"/"+req.params.subj);

            }
        }

    })

});

// DELETE FILE
router.post('/files/:no/:subj/:postid/:id', isLoggedIn, function(req, res){
    
    Post.findOne({_id : req.params.postid}, function (err, post) {
        if(err){
            console.log("Error in /delete file: " + err);
            res.redirect("/sem/"+req.params.no+"/"+req.params.subj);
        }
        else{
            if(post.author.name == req.user.username || req.user.isAdmin){
                gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
                    if (err) {
                      return res.status(404).json({ err: err });
                    }
                    else{
                        for(var i = post.files.length - 1; i >= 0; i--) {
                            if(post.files[i] == req.params.id) {
                                post.files.splice(i, 1);
                                post.save(); 
                                req.flash("success","Successfully deleted file!"); 
                                res.redirect("/sem/"+req.params.no+"/"+req.params.subj);
                            }
                        }
                        
                    }
                  });
            }
            else{
                req.flash("error","You don't have permission to do that");  //When non-author tries to delete
                res.redirect("/sem/"+req.params.no+"/"+req.params.subj);

            }
        }

    })

});

//DOWNLOAD FILE 
router.get('/Download/:id', isLoggedIn, function(req,res){    
    const file_id = new mongoose.mongo.ObjectId(req.params.id);
    
    gfs.files.findOne({_id: file_id},function (err, files) {
        
        if(!files || files.length === 0){
            return res.status(404).json({
                err: 'No files exists'
            });
        }
        
        res.set('Content-Type', files.contentType);
        res.set('Content-Disposition', 'attachment; filename="' + files.filename + '"');

        var readstream = gfs.createReadStream({
        _id: file_id,
        root: 'uploads'
        });

        readstream.on("error", function(err) { 
            res.end();
        });
        readstream.pipe(res);
        
  });
});

// middle ware function
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
}

module.exports = router;