var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();
require('./db');
const mongoose = require('mongoose');
require('./auth');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


var passport = require('passport');
var sessionOptions = {
	secret: 'secret cookie thang',
	resave: true,
	saveUninitialized: true

}

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());



const User = mongoose.model('User');






app.get('/', (req, res)=>{
	if(req.user == null){
		const notLoggedIn = true;
		const LoggedIn = true;
		// res.render('home', {notLoggedIn: notLoggedIn, layout: 'logNav'});
		res.render('null', {layout: 'notLoggedIn'});
	}
	else{
		const user = req.user.username;
		// res.render('home', {user:user, layout: 'nav'});
		res.redirect("/about");
	}
})

app.get('/question', (req, res)=>{
	if (req.user){
		User.findOne({username: req.user.username}, function(err, user){
			if (user.lastname && user.firstname && user.year && user.gpa && user.major && user.challenge && user.hour && user.extra){
				var gpa = user.gpa;
				if (gpa == "4" ||  gpa == "3" || gpa == "2" || gpa == "1" || gpa == "0"){
					gpa = gpa + ".0";

				}
				res.render('fillinquestions', {layout: 'navlayout', lastname: user.lastname, firstname: user.firstname, year: user.year, gpa: gpa, major: user.major, challenge: user.challenge, hour: user.hour, extra: user.extra });
			}
			else{
				res.render('questions', {layout: 'navlayout'});
				// console.log("haha");
			}
		});

	}
	else{
		res.redirect('/');
	}
	


})

app.get('/recommend', (req, res) =>{
	if (req.user){
		if (req.user.challenge){
			res.render('recommend', {layout: "navlayout"});

		}
		else{
			res.redirect('/question');
		}
		
	}
	else{
		res.redirect('/');
	}

})


app.post('/recommend', (req, res) =>{

	const firstClass = req.body.name;
	const secondClass = req.body.name1;
	const thirdClass = req.body.name2;
	const fourthClass = req.body.name3;
	const fifthClass = req.body.name4;


	User.findOne({username: req.user.username},function(err, user){
		res.render('result', {layout: 'navlayout', challenge: user.challenge, f1: firstClass, f2: secondClass, f3: thirdClass, f4: fourthClass, f5: fifthClass})
	})



})

app.post('/', (req, res, next)=>{
	if (req.body.check == "true"){
			User.register(new User({username: req.body.username}),
		req.body.password, function(err, user){
			if(err){
				res.render('null', {layout: 'notLoggedIn', message: 'Your registration information is not valid'})
			} else{
				passport.authenticate('local')(req, res, function(){
					res.redirect('/about');
				});
			}
		})

	}
	else{
		console.log(req.body.check);
		passport.authenticate('local', function(err, user){
			if(user){
				console.log("h1");
				req.logIn(user, function(error){
					console.log(user);
					res.redirect('/about');
				});
			} else{
				console.log("entered");
				res.render('null',  {layout: 'notLoggedIn', message:'Your username or password is incorrect.'})
			}
		})(req, res, next);

	}

})



app.get('/random', (req, res)=>{

	res.render('random', {layout: "navlayout"});
});




app.get('/logout', (req, res)=>{
	req.session.destroy(function(err){
		res.redirect('/');
	})
	
});

app.get('/about', (req, res)=>{

	
	if(req.user == null){

		res.redirect('/');
	}
	else{

		res.render('aboutpage', {layout:'navlayout'});
	}
})









app.get("/transcript", (req, res)=>{
	if (req.user){

	res.render('transcript', {layout:'navlayout'});
	}
	else{
		res.redirect('/');
	}

});

app.get('/profile', (req, res)=>{
	
	if (req.user){
		User.findOne({username: req.user.username}, (err, user)=>{
			
				res.render('profile', {layout: 'navlayout', firstname: user.firstname, lastname: user.lastname, year: user.year, gpa: user.gpa, major: user.major, hour: user.hour, challenge: user.challenge, extra: user.extra, courses: user.courses });

			

			
		})
		
	}
	else{
		res.redirect("/");
	}
})

app.post('/profile', (req, res) =>{
	const deleteBtn = req.body.submit;
	
	// const deleteIndex = req.body.submit;
	// console.log(deleteIndex);

	// const unsetIndex = "courses."+(deleteBtn);
	// User.update({username: req.user.username}, {'$' : {unsetIndex : 1 }});
	// User.findOneAndUpdate({username: req.user.username}, {$pull : {"courses" : null}})
	
 // 	User.update({username: req.user.username}, {$unset: {"courses.0": 1}})
	// User.update({username: req.user.username}, {$pull: {"courses": null}})
	// var messager = User.find({username: req.user.username},  {courses: {$slice: [-1,1] }});
	// console.log(messager[0]);
	// 	console.log(messager[1]);
	// 		console.log(messager[2]);
	User.findOneAndUpdate(
	  { username: req.user.username},
	  {$pull: { courses: {courseName: req.user.courses[deleteBtn].courseName} } },
	  function removeConnection(err, user){
		// res.render('profile',{layout: 'navlayout', firstname: user.firstname, lastname: user.lastname, year: user.year, gpa: user.gpa, major: user.major, hour: user.hour, challenge: user.challenge, extra: user.extra, courses: user.courses });
		res.redirect('/profile');
	  }
	);


	// User.findOne({username: req.user.username}, (err, user)=>{
	// 	var removeContent = user.courses[0].courseName;
	// 	console.log(removeContent);
	// 	// User.update({username: req.username}, {$pull, {'courses': {'courseName': removeContent}}});
	// 	User.update(
	//   { username: req.user.username},
	//   { '$pull': { 'courses.courseName': removeContent } }
	// );

	// 	console.log(user.courses[0]);
	// 	res.render('profile',{layout: 'navlayout', firstname: user.firstname, lastname: user.lastname, year: user.year, gpa: user.gpa, major: user.major, hour: user.hour, challenge: user.challenge, extra: user.extra, courses: user.courses });

	// });
})

app.post('/transcript', (req, res)=>{
	const student = req.user.username;
	const courseName = req.body.class_name;
	const professor = req.body.class_professor;
	const grade = req.body.class_grade;
	const interest = req.body.class_interest;
	const difficulty = req.body.class_difficulty;


	if (student){
		User.findOneAndUpdate({username: student}, 
			{$push: 
				{"courses": 
					{
						courseName: courseName, 
						professor: professor, 
						grade: grade, 
						interest: interest, 
						difficulty: difficulty
					}
			}
		},
			{safe: true, upsert: true},
			function(err, model){
				console.log(err)
			}
		);

		res.render('transcript', {layout: 'navlayout', message: 'Add Another Class'});
	}
	else{
		res.redirect("/");
	}

	

});




app.post('/question', (req, res)=>{
	const student = req.user.username;
	const fm = req.body.firstname;
	const lm = req.body.lastname;
	const degree = req.body.year;
	const grade = req.body.gpa;
	const mj = req.body.major;
	const time = req.body.hour;
	const difficulty = req.body.challenge;
	const other = req.body.extra;
	if (student && fm && lm && degree && grade && mj && time && difficulty && other){
		User.findOneAndUpdate({username: student},{$set:{firstname:fm, lastname:lm, year:degree, gpa:grade, major:mj, hour:time, challenge: difficulty, extra: other}}, (err, list)=>{
		
		if (err){
			res.render('questions', {layout: 'navlayout', message: err});
		}
		res.redirect('/profile');
	});	
	}
	else{
	res.render('questions', {layout: 'navlayout', message: 'Please fill in the missing information'});
	}

})







app.listen(process.env.PORT || 3000);
