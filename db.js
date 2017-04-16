var mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
var passportLocalMongoose = require('passport-local-mongoose');
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
	gender: String,
	frequency: String,
	description: String,


});


User.plugin(passportLocalMongoose);
List.plugin(URLSlugs('advice'));

// register the schema so that mongoose know about it
mongoose.model("Comment", Comment);
mongoose.model("List", List);
mongoose.model("User", User);

if (process.env.NODE_ENV === 'PRODUCTION'){
	var fs = require('fs');
	var path = require('path');
	var fn = path.join(__dirname, 'conf.json');
	var data = fs.readFileSync(fn);

	var conf = JSON.parse(data);
	var dbconf = conf.dbconf;}
	
else{
	dbconf = 'mongodb://localhost/finalProject';



}
mongoose.connect(dbconf);

