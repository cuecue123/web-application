var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();
require('./db');
const mongoose = require('mongoose');
// const Message = mongoose.model('Message');
// const Event = mongoose.model('Event');
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
	res.redirect('/question');
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
