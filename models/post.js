var mongoose = require("mongoose");

var PostSchema = new mongoose.Schema({
    title: String,
    content: String,
    postdate: {type: Date, default: Date.now},
    author: {
        id : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user' 
        },
        name: String
    },
    files: [
        {   type: mongoose.Schema.Types.ObjectId, 
            ref: 'GFS',
        }
    ]
});

module.exports = mongoose.model("Post",PostSchema);
