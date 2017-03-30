var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
require('./db');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


var sessionOptions = {
	secret: 'secret cookie thang',
	resave: true,
	saveUninitialized: true

}

app.use(session(sessionOptions));


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




app.get('/', (req, res) => {


	List.find({}, (err, lists) => {


		res.render('index', {lists:lists});

	});
});

app.post('/result', (req, res) => {
	const list = new List({
		advice: req.body.advice, 
		user: req.body.user, 
		
	});
	list.save((err, lists) => {
		if(err) {
			res.send(err); 
		}
		res.redirect('/');
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
	console.log('here we get our '+ slug1)
	List.findOneAndUpdate({slug:slug1}, {$push: {comments: {text: req.body.text, user: req.body.user}}}, (err, list)=>{
		
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



app.listen(3000);
