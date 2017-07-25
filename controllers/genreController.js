// Models required
var Genre = require('../models/genre');
var Book = require('../models/book');

// required dependencies
var mongoose = require('mongoose');
var async = require('async');

// Display list of all Genre
exports.genre_list = function(req,res,next) {
	Genre.find()
	.sort([['name','ascending']])
	.exec(function(err,list_authors){
		if(err) return next(err);
		res.render('genre_list', {title: 'Genre List', genre_list: list_authors});
	});
};

// Display detail page for a specific Genre
exports.genre_detail = function(req,res,next) {
	var id = mongoose.Types.ObjectId(req.params.id.trim());

	async.parallel({
		genre: function(callback){
			Genre.findById(id)
			.exec(callback);
		},
		genre_books: function(callback){
			Book.find({'genre': id})
			.populate('author')
			.exec(callback);
		}	
	}, function(err,results){
		if(err) return next(err);
		res.render('genre_detail', {title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books});
	});
};

// Display Genre create form on GET
exports.genre_create_get = function(req,res,next) {
	res.render('genre_form', {title: 'Create Genre'});
};

// Handle Genre create on POST
exports.genre_create_post = function(req,res,next) {
	//Check that name is not empty
	req.checkBody('name', 'Genre name required').notEmpty();

	//trim and escape name field
	req.sanitize('name').escape();
	req.sanitize('name').trim();

	// run validators
	var errors = req.validationErrors();
	var genre = new Genre({
		name: req.body.name
	});

	if(errors){
		res.render('genre_form', {title: 'Create Genre', genre: genre, errors: errors});
		return;
	} else {
		//Checking if genre already exists
		Genre.findOne({'name': req.body.name})
		.exec(function(err, found_genre){
			if(err) return next(err);
			if(found_genre){
				console.log('found_genre: '+found_genre);
				res.redirect(found_genre.url);
			} else {
				// saved to database
				genre.save(function(err){
					if(err) return next(err);
					res.redirect(genre.url); // go to genre page
				});
			}
		});
	}
};

// Display Genre delete form on GET
exports.genre_delete_get = function(req, res) {
	res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST
exports.genre_delete_post = function(req, res) {
	res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET
exports.genre_update_get = function(req, res) {
	res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST
exports.genre_update_post = function(req, res) {
	res.send('NOT IMPLEMENTED: Genre update POST');
};