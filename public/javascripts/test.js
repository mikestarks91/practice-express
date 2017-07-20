$(document).ready(function(){
	var books = author_books;
	books = JSON.parse(books);
	console.log(books);
	var genres_list = new String();
	var genres = new Array();

	for(var i=0, len=books.length;i<len;i++){
		var genres = uniqueGenreCollector(genres,books[i].genre);
	}
	for(var j=0, len=genres.length;j<len;j++){
		if(j>0){
			genres_list += ", "+genres[j];
		} else {
			genres_list += genres[j];
		}
	}
	$("#author-genres").html(genres_list);
});

var uniqueGenreCollector = function(arr1,arr2){
	var unique = arr1;
	for(var i=0,len=arr2.length;i<len;i++){
		if(unique.indexOf(arr2[i].name)===-1){
			unique.push(arr2[i].name);
		}
	}
	// unique.sort(sort_by('name', false, function(a){return a.toUpperCase();}));
	// console.log(unique);
	return unique;
}

var sort_by = function(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}