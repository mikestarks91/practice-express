// Needs all models to be able to query
var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

var mongoose = require('mongoose');
var async = require('async');

exports.index = function(req, res) {

	async.parallel({
		book_count: function(callback){
			Book.count(callback);
		},
		book_instance_count: function(callback){
			BookInstance.count(callback);
		},
		book_instance_available_count: function(callback){
			BookInstance.count({status:'Available'},callback);
		},
		author_count: function(callback){
			Author.count(callback);
		},
		genre_count: function(callback){
			Genre.count(callback);
		}
	},function(err,results){
		res.render('index', {title: 'Local Library Home', error: err, data: results})
	})
};

// Display list of all books
exports.book_list = function(req,res,next) {
	
	Book.find({}, 'title author ')
	.populate('author')
	.exec(function(err,list_books){
		if(err){return next(err);}
		res.render('book_list', {title: 'Book List', book_list: list_books});
	});
};

// Display detail page for a specific book
exports.book_detail = function(req,res,next) {
	var id = mongoose.Types.ObjectId(req.params.id.trim());

	async.parallel({
		book: function(callback){

			Book.findById(id)
			.populate('author')
			.populate('genre')
			.exec(callback);
		},
		book_instance: function(callback){

			BookInstance.find({'book': id})
			.exec(callback);
		},
	}, function(err,results){
		if(err) return next(err);
		res.render('book_detail', {title: 'Title', book: results.book, book_instances: results.book_instance});
	});
};

// Display book create form on GET
exports.book_create_get = function(req,res,next) {
	async.parallel({
		authors: function(callback){
			Author.find(callback);
		},
		genres: function(callback){
			Genre.find(callback);
		}
	}, function(err,results){
		if(err) return next(err);
		res.render('book_form', {title: 'Create Book', authors: results.authors, genres: results.genres});
	});
};

// Handle book create on POST
exports.book_create_post = function(req,res,next) {
	req.checkBody('title', 'Title must not be empty.').notEmpty();
	req.checkBody('author', 'Author must not be empty').notEmpty();
	req.checkBody('summary', 'Summary must not be empty').notEmpty();
	req.checkBody('isbn', 'ISBN must not be empty').notEmpty();

	req.sanitize('title').escape();
	req.sanitize('author').escape();
	req.sanitize('summary').escape();
	req.sanitize('isbn').escape();
	req.sanitize('title').trim();
	req.sanitize('author').trim();
	req.sanitize('summary').trim();
	req.sanitize('isbn').trim();
	req.sanitize('genre').escape();

	var book = new Book({
		title: req.body.title,
		author: req.body.author,
		summary: req.body.summary,
		isbn: req.body.isbn,
		genre: (typeof req.body.genre==='undefined' ? [] : req.body.genre.split(","))
	});

	console.log('BOOK: '+book);

	var errors = req.validationErrors();
	if(errors){
		async.parallel({
			authors: function(callback){
				Author.find(callback);
			},
			genres: function(callback){
				Genre.find(callback);
			}
		}, function(err,results){
			if(err) return next(err);

			// Mark selected Genres 'checked'
			for(var i=0,len=results.genres.length;i<len;i++){
				if(book.genre.indexOf(results.genres[i]._id) > -1){
					results.genres[i].checked='true';
				}
			}

			res.render('book_form', {
				title: 'Create Book',
				authors: results.authors,
				genres: results.genres,
				book: book,
				errors: errors
			});
		});
	} else {
		// Form data is valid
		book.save(function(err){
			if(err) return next(err);
			res.redirect(book.url);
		});
	}
};

// Display book delete form on GET
exports.book_delete_get = function(req, res) {
	res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST
exports.book_delete_post = function(req, res) {
	res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET
exports.book_update_get = function(req, res) {
	res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST
exports.book_update_post = function(req, res) {
	res.send('NOT IMPLEMENTED: Book update POST');
};