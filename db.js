var mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// my schema goes here!
// generate and connect to a new database

// create new schema: whichis a MongoDB collection, included multiple documnets, with field and value pair



var Comment = new mongoose.Schema({
	text: {type:String,required:true},
	user: {type:String, required:true},

});


var List = new mongoose.Schema({
	advice: String,
	user: String,
	count: {type: Number, default: 0},
	comments: [Comment],
	// createdAt: timestamp


});


var User = new mongoose.Schema({
	username: String,
	password: String,

});



List.plugin(URLSlugs('advice'));

// register the schema so that mongoose know about it
mongoose.model("Comment", Comment);
mongoose.model("List", List);
mongoose.model("User", User);


mongoose.connect('mongodb://localhost/finalProject');