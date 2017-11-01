var mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
var passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
	username: String,
	password: String,
	netId: String,
	firstname: String,
	lastname: String,
	year: Number,
	gpa: Number,
	major: String,
	extra: String,
	challenge: String,
	challenge: String,
	courses: [
		{
			courseName: {type: String, required: true},
			professor: {type: String, required: true},
			grade: {type: String, required: true},
			interest: {type: Number, required: true},
			difficulty: {type: Number, required: true},
		}
	]
});







User.plugin(passportLocalMongoose);




mongoose.model("User", User);

if (process.env.NODE_ENV === 'PRODUCTION'){
	var fs = require('fs');
	var path = require('path');
	var fn = path.join(__dirname, 'conf.json');
	var data = fs.readFileSync(fn);

	var conf = JSON.parse(data);
	var dbconf = conf.dbconf;}
	
else{
	dbconf = 'mongodb://localhost/project';



}
mongoose.connect(dbconf);


