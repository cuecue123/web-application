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


// const Message = mongoose.model('Message');
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

app.post('/', (req, res, next)=>{
	if (req.body.check == "true"){
			User.register(new User({username: req.body.username}),
		req.body.password, function(err, user){
			if(err){
				res.render('register', {layout: 'other', message: 'Your registration information is not valid'})
			} else{
				passport.authenticate('local')(req, res, function(){
					res.redirect('list');
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
					console.log(user+"~~~~~");
					res.redirect('/list');
				});
			} else{
				console.log("entered");
				res.render('null',  {layout: 'notLoggedIn', message:'Your login or password is incorrect.'})
			}
		})(req, res, next);

	}

})

app.post('/signin', (req, res, next) =>{



});

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

app.get('/random', (req, res)=>{

	res.render('random');
});


// app.get('/login', (req, res)=>{
// 	res.render('login', {layout: 'other'});
// });

// app.post('/login', (req, res, next)=>{
// 	passport.authenticate('local', function(err, user){
// 		if(user){
// 			req.logIn(user, function(error){
// 				console.log(user);
// 				res.redirect('/list');
// 			});
// 		} else{
// 			res.render('login',  {layout: 'other', message:'Your login or password is incorrect.'})
// 		}
// 	})(req, res, next);
// });

// app.post('/', (req, res, next)=>{
// 	passport.authenticate('local', function(err, user){
// 		if(user){
// 			req.logIn(user, function(error){
// 				console.log(user);
// 				res.redirect('/list');
// 			});
// 		} else{
// 			res.render('login',  {layout: 'other', message:'Your login or password is incorrect.'})
// 		}
// 	})(req, res, next);
// });


app.get('/logout', (req, res)=>{
	req.session.destroy(function(err){
		res.redirect('/');
	})
	
});

app.get('/about', (req, res)=>{

	
	if(req.user == null){

		res.render('about', {layout: 'logLayout'});
	}
	else{

		res.render('about');
	}
})




app.get('/register', (req, res)=>{
	res.render('register',{layout: 'other'});
});


app.get('/chat', (req, res) => {

	if (req.user != null){
		const userNow = req.user.username;
		const userGender = req.user.gender;
		console.log(req.user.gender);
		res.render('chat',{userNow: userNow, userGender: userGender});
	} else{
		res.redirect('/')

	}

});

app.get('/finalProject/messages', (req, res) => {
    Message.find((err, messages) => {
        res.json(messages); 
    });
});

app.post('/finalProject/messages', (req, res) => {

    (new Message({
        message:req.body.message,
        from:req.body.from,
        gender:req.body.gender, 
    })).save((err, message) => {
        if(err) {
            console.log(err); 
            res.json(err); 
        } else {
            res.json(message); 
        }
    });
});



// app.post('/register', (req, res)=>{
// 	User.register(new User({username: req.body.username}),
// 		req.body.password, function(err, user){
// 			if(err){
// 				res.render('register', {layout: 'other', message: 'Your registration information is not valid'})
// 			} else{
// 				passport.authenticate('local')(req, res, function(){
// 					res.redirect('list');
// 				});
// 			}
// 		})
// })


app.post('/result', (req, res) => {
	const list = new List({
		advice: req.body.advice, 
		user: req.user.username, 
		
	});
	const userNow = req.user.username;
	list.save((err, lists) => {
		if(err) {
			console.log(err);
			res.render('index', {lists:lists, userNow: userNow, err: err})
		}
		else{
			res.redirect('/list')
		};
	});
});

app.get('/signup', (req, res)=>{
	console.log('entered');
	const Notsigned = true;
	const userNow = req.user.username;
	if (req.user.gender){
		User.findOne({username: userNow}, function(err, user){
		res.render('signup', {user:user});

		});

	}
	else{	

		res.render('signup', {Notsigned: Notsigned});

	}
})

app.get('/:slug', (req, res) => {
	var slug = req.params.slug;

	// var lastComment = req.session.lastComment;
	List.findOne({slug: slug}, function(err, list){
		console.log(err);
		res.render('comments', {list: list, layout: 'other'});
	});




});

app.post('/signup', (req, res)=>{
	const userNow = req.user.username;
	const userGender = req.body.gender;
	const freq = req.body.frequency;
	// const loc = req.body.location;
	const des = req.body.description;

	User.findOneAndUpdate({username: userNow},{$set:{gender:userGender, frequency:freq, description: des}}, (err, list)=>{
		
		if (err){
			res.send(err);
		}
		res.redirect('/signup');

	});
})



app.post('/comments', (req, res) =>{

	var slug1 = req.body.slug;
	List.findOneAndUpdate({slug:slug1}, {$push: {comments: {text: req.body.text, user: req.user.username}}}, (err, list)=>{
		
		if (err){
			// console.log(err);
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
