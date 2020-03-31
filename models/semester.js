var mongoose              = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var SemesterSchema = new mongoose.Schema({
    sem: String,
    subjects:[
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'subject' 
        }
    ]
});

module.exports = mongoose.model("Semester",SemesterSchema);