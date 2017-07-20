var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookSchema = Schema({
	title: {type: String, required: true},
	author: {type: Schema.ObjectId, ref: 'Author', required: true},
	summary: {type: String, required: true},
	isbn: {type: String, required: true},
	genre: [{type: Schema.ObjectId, ref: 'Genre'}]
});

BookSchema
.virtual('url')
.get(function(){
	return '/catalog/book/'+this._id;
});

BookSchema
.virtual('genre_list')
.get(function(){
	var genre_list = new String();
	for(var i=0, len=this.genre.length; i<len; i++){
		if(i<len-1){
			genre_list += '<a href=\"'+this.genre[i].url+'\">'+this.genre[i].name+'<a/>,&npsb';
		} else {
			genre_list += '<a href=\"'+this.genre[i].url+'\">'+this.genre[i].name+'<a/>';
		}
	}
	return genre_list;
});

module.exports = mongoose.model('Book', BookSchema);