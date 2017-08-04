var mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
var passportLocalMongoose = require('passport-local-mongoose');


function checkValid(val){
	return val.length >= 10;
}




var User = new mongoose.Schema({
	username: {type: String},
	password: {type: String},
	netId: {type: String},
	firstname: {type: String},
	lastname: {type: String},
	year: {type: Number},
	gpa: {type: Number},
	major: {type: String},
	hour: {type: Number},
	extra: {type: String},
	challenge: {type: String},
	courses: [
	{
		courseName: {type: String, required: true},
		professor: {type: String, required: true},
		grade: {type: String, required: true},
		interest: {type: Number, required: true},
		difficulty: {type: Number, required: true},
	}


	],


	


});




User.plugin(passportLocalMongoose);


mongoose.model("User", User);

// if (process.env.NODE_ENV === 'PRODUCTION'){
// 	var fs = require('fs');
// 	var path = require('path');
// 	var fn = path.join(__dirname, 'conf.json');
// 	var data = fs.readFileSync(fn);

// 	var conf = JSON.parse(data);
// 	var dbconf = conf.dbconf;}
	
// else{
	dbconf = 'mongodb://localhost/finalProject';



// }
mongoose.connect(dbconf);

