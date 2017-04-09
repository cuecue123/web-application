var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
require('./db');
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


const mongoose = require('mongoose');
const List = mongoose.model('List');
const User = mongoose.model('User');



list = new List({
	advice: "Borrow 100 dollars from a stranger",
	user: "Qiuxuan",
	count:0,
	comments:[{
		text: "I can't do this!!!!",
		user: "E.T"
	}],

});

list.save(function(err, list){


})

list2 = new List({
	advice: "Ask to be the starbucks greeter",
	user: "Susan",
	count:0,
	comments:[{
		text: "that's hialrious",
		user: "S.C"
	}],

});

list2.save(function(err, list2){


})



app.get('/', (req, res)=>{
	if(req.user == null){
		const notLoggedIn = true;
		res.render('home', {notLoggedIn: notLoggedIn, layout: 'nav'});
	}
	else{
		const user = req.user.username;
		res.render('home', {user:user, layout: 'nav'});
	}
})

app.get('/list', (req, res) => {


	List.find({}, (err, lists) => {

		if (req.user != null){
			const userNow = req.user.username;
			console.log(req.user.username);
			res.render('index',{lists:lists, userNow: userNow});
		} else{
			res.redirect('/');

		}
		
		

	});
});

app.get('/login', (req, res)=>{
	res.render('login');
});

app.post('/login', (req, res, next)=>{
	passport.authenticate('local', function(err, user){
		if(user){
			req.logIn(user, function(error){
				console.log(user);
				res.redirect('/list');
			});
		} else{
			res.render('login', {message:'Your login or password is incorrect.'})
		}
	})(req, res, next);
})


app.get('/register', (req, res)=>{
	res.render('register');
});


app.post('/register', (req, res)=>{
	User.register(new User({username: req.body.username}),
		req.body.password, function(err, user){
			if(err){
				res.render('register', {message: 'Your registration information is not valid'})
			} else{
				passport.authenticate('local')(req, res, function(){
					res.redirect('list');
				});
			}
		})
})


app.post('/result', (req, res) => {
	const list = new List({
		advice: req.body.advice, 
		user: req.user.username, 
		
	});
	list.save((err, lists) => {
		if(err) {
			res.send(err); 
		}
		res.redirect('/list');
	});
});

app.get('/:slug', (req, res) => {
	var slug = req.params.slug;

	// var lastComment = req.session.lastComment;
	List.findOne({slug: slug}, function(err, list){
		res.render('comments', {list: list, layout: 'other'});
	});

});

app.post('/comments', (req, res) =>{
	req.session.lastComment = req.body.text;

	var slug1 = req.body.slug;
	// console.log('here we get our '+ slug1)
	List.findOneAndUpdate({slug:slug1}, {$push: {comments: {text: req.body.text, user: req.user.username}}}, (err, list)=>{
		
		if (err){
			res.send(err);

		}
		res.redirect('/'+slug1);
	})



})

app.post('/count', (req, res)=>{
	var slug1 = req.body.slug;
	List.findOneAndUpdate({slug:slug1},{$inc:{count: 1}},(err,list)=>{
		console.log(slug1);
		res.redirect('/'+slug1);
	});
	

})

app.post('/countdown', (req, res)=>{
	var slug1 = req.body.slug;
	List.findOneAndUpdate({slug:slug1},{$inc:{count: -1}},(err,list)=>{
		console.log(slug1);
		res.redirect('/'+slug1);
	});
	

})



app.listen(process.env.PORT || 3000);
