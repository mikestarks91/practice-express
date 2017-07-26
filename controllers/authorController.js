var Author = require('../models/author');
var Book = require('../models/book');
var Genre = require('../models/genre');

var mongoose = require('mongoose');
var async = require('async');

// Display list of all Authors
exports.author_list = function(req,res,next){
	Author.find()
	.sort([['family_name', 'ascending']])
	.exec(function(err,list_authors){
		if(err) return next(err);
		res.render('author_list', {title: 'Author List', author_list: list_authors});
	});
};

// Display detail page for a specific Author
exports.author_detail = function(req,res,next) {
	var id = mongoose.Types.ObjectId(req.params.id.trim());

	async.parallel({
		author: function(callback){
			Author.findById(id)
			.exec(callback);
		},
		authors_books: function(callback){
			Book.find({
				'author': id
			}, 'title summary genre')
			.populate('genre')
			.exec(callback)
		}
	}, function(err,results){
		if(err) return next(results);
		res.render('author_detail', {title: 'Author Detail', author: results.author, author_books: results.authors_books});
	});
};

// Display Author create form on GET
exports.author_create_get = function(req,res,next) {
	res.render('author_form', {title: 'Create Author'});
};

// Handle Author create on POST
exports.author_create_post = function(req,res,next) {
	req.checkBody('first_name', 'First name must be specified.').notEmpty();
	req.checkBody('family_name', 'Family name must be specified.').notEmpty();
	req.checkBody('family_name', 'Family name must be alphanumeric text.').isAlpha();
	req.checkBody('nicknames', 'Not comma-separated').optional({ checkFalsy: true})
	req.checkBody('date_of_birth', 'Invalid date').optional({ checkFalsy: true}).isDate(); //optional field allows us to accept a blank value here. No further validation if blank
	req.checkBody('date_of_death', 'Invalid date').optional({ checkFalsy: true}).isDate(); //optional field allows us to accept a blank value here

	req.sanitize('first_name').escape();
	req.sanitize('family_name').escape();
	req.sanitize('first_name').trim();     
	req.sanitize('family_name').trim();
	req.sanitize('date_of_birth').toDate();
	req.sanitize('date_of_death').toDate();

	var errors = req.validationErrors();

	var author = new Author({
		first_name: req.body.first_name,
		family_name: req.body.family_name,
		nicknames: (typeof req.body.nicknames==='undefined' ? [] : req.body.nicknames.split(",")),
		date_of_birth: req.body.date_of_birth,
		date_of_death: req.body.date_of_death
	});

	if(errors){
		res.render('author_form', {title: 'Create Author', author: author, errors: errors});
		return;
	} else {
		author.save(function(err){
			if(err) return next(err);
			res.redirect(author.url);
		});
	}
};

// Display Author delete form on GET
exports.author_delete_get = function(req,res,next) {
	var id = mongoose.Types.ObjectId(req.params.id.trim());

	async.parallel({
		author: function(callback){
			Author.findById(id).exec(callback);
		},
		authors_books: function(callback){
			Book.find({'author': id}).exec(callback);
		}
	}, function(err,results){
		if(err) return next(err);
		res.render('author_delete', {title: 'Delete Author', author: results.author, author_books: results.authors_books});
	});
};

// Handle Author delete on POST
exports.author_delete_post = function(req,res,next) {
	var id = mongoose.Types.ObjectId(req.body.authorid.trim());

	async.parallel({
		author: function(callback){
			Author.findById(id).exec(callback);
		},
		authors_books: function(callback){
			Book.find({'author': id}, 'title summary').exec(callback);
		}
	}, function(err,results){
		if(err) return next(err);
		if(results.authors_books>0){
			res.render('author_delete', {title: 'Delete Author', author: results.author, author_books: results.authors_books});
			return;
		} else {
			Author.findByIdAndRemove(id, function deleteAuthor(err){
				if(err) return next(err);
				res.redirect('/catalog/authors');
			});
		}
	});
};

// Display Author update form on GET
exports.author_update_get = function(req, res) {
	res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST
exports.author_update_post = function(req, res) {
	res.send('NOT IMPLEMENTED: Author update POST');
};