var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();
require('./db');
const mongoose = require('mongoose');
const Message = mongoose.model('Message');
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
		res.render('null', {user: user, layout:'LoggedIn'});
	}
})

app.get('/question', (req, res)=>{
	if (req.user){
		User.findOne({username: req.user.username}, function(err, user){
			if (user.lastname && user.firstname && user.year && user.gpa && user.major){
				console.log("haha");
				res.render('filledIn', {fm:user.firstname, lm:user.lastname, degree:user.year, grade:user.gpa, mj:user.major, time:user.hour, difficulty:user.challenge, other:user.extra, one:user.subject1, two:user.subject2, three:user.subject3});
			}
			else{
				res.render('questionnaire');
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
				res.render('null', {layout: 'NotSignedUp', message: 'Your registration information is not valid'})
			} else{
				passport.authenticate('local')(req, res, function(){
					res.redirect('/question');
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
					res.redirect('/question');
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














app.post('/question', (req, res)=>{
	const student = req.user.username;
	const fm = req.body.firstname;
	const lm = req.body.firstname;
	const degree = req.body.year;
	const grade = req.body.gpa;
	const mj = req.body.major;
	const time = req.body.hour;
	const difficulty = req.body.challenge;
	const other = req.body.extra;
	const one = req.body.subject1;
	const two = req.body.subject2;
	const three = req.body.subject3;
	if (student && fm && lm && degree && grade && mj){
		User.findOneAndUpdate({username: student},{$set:{firstname:fm, lastname:lm, year:degree, gpa:grade, major:mj, hour:time, challenge: difficulty, extra: other, subject1: one, subject2: two, subject3: three}}, (err, list)=>{
		
		if (err){
			res.send(err);
		}
		res.render('filledin', {fm:fm, lm:lm, degree:degree, grade:grade, mj:mj, time:time, difficulty:difficulty, other:other, one:one, two:two, three:three});

	});	
	}
	else{
	res.redirect("/question");
	}

})








app.listen(process.env.PORT || 3000);
