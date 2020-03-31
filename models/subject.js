var mongoose              = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var SubjectSchema = new mongoose.Schema({
    name: String,
    teacher: String,
    code: String,
    posts: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Post' 
        }
    ]
});

module.exports = mongoose.model("Subject",SubjectSchema);