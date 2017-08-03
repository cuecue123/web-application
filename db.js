var mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
var passportLocalMongoose = require('passport-local-mongoose');
// my schema goes here!
// generate and connect to a new database

// create new schema: whichis a MongoDB collection, included multiple documnets, with field and value pair



// function checkValid(val){
// 	alph = false;
// 	num = false;
// 	if (val.length >= 8){
// 		for (let i = 0; i < val.length; i++){
// 			if (val.charAt(i).match('/^[a-zA-Z()]+$/')){
// 				alph = true;

// 			}
// 			else if (Number.isInteger(parseInt(val.charAt(i)))){
// 				num = true;

// 			}
// 		}
// 		if (alph && num){
// 			return true;
// 		}
// 		else{
// 			return false;
// 		}
// 	}

// }

// var s = '123456';
// for ( var i = 0; i < s.length; i++ )
// {
//   // `s.charAt(i)` gets the character
//   // you may want to do a some jQuery thing here, like $('<img...>')
//   document.write( '<img src="' + s.charAt(i) + '.png" />' );
// }

// const custom = [checkValid, 'uh oh, password length should be at least 8, and it should contain both letter and numbers']

function checkValid(val){
	return val.length >= 10;
}

const custom = [checkValid, 'uh oh, the advice is too short!!']


var Comment = new mongoose.Schema({
	text: {type:String,required:true},
	user: {type:String, required:true},

});


var List = new mongoose.Schema({
	advice: {type: String, required: true, validate: custom},
	user: {type:String, required: true},
	count: {type: Number, default: 0},
	comments: [Comment],
	// createdAt: timestamp


});


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

// const Message = new mongoose.Schema({
//     message: {type: String},
//     from: {type: String},
//     gender: {type: String},
// });


// const Question = new mongoose.Schema({
// 	username: {type: String},
// 	firstname: {type: String},
// 	lastname: {type: String},
// 	year: {type: Number},
// 	gpa: {type: Number},
// 	major: {type: String},
// 	hour: {type: String},
// 	challenge: {type: String},
// 	extra: {type: String},
// 	subject1: {type: String},
// 	subject2: {type: String},
// 	subject3: {type: String},
// })







User.plugin(passportLocalMongoose);
List.plugin(URLSlugs('advice'));

// register the schema so that mongoose know about it

// mongoose.model('Message', Message);
// mongoose.model("Comment", Comment);
// mongoose.model("List", List);
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

