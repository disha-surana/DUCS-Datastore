var mongoose = require("mongoose");
var GFS = mongoose.model("GFS", new mongoose.Schema({}, {strict: false}), "uploads.files" );

module.exports = GFS;
