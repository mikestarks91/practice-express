var mongoose = require('mongoose');
var moment = require('moment');
// Needs mongoose API first

var Schema = mongoose.Schema;
// Create new schema constructor

var AuthorSchema = Schema({
	first_name: {type: String, required: true, max: 100},
	family_name: {type: String, required: true, max: 100},
	date_of_birth: {type: Date},
	date_of_death: {type: Date}
});

AuthorSchema
.virtual('name')
.get(function(){
	return this.family_name+', '+this.first_name;
});

AuthorSchema
.virtual('url')
.get(function(){
	return '/catalog/author/'+this._id;
});

AuthorSchema
.virtual('dob_formatted')
.get(function(){
	return this.date_of_birth ? moment(this.date_of_birth).format('MMMM Do, YYYY') : '';
});

AuthorSchema
.virtual('dod_formatted')
.get(function(){
	return this.date_of_death ? moment(this.date_of_death).format('MMMM Do, YYYY') : '';
});

// Export the model
module.exports = mongoose.model('Author', AuthorSchema);