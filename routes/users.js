var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
	res.send('respond with a resource');
});

router.get('/allofthem', function(req,res){
	res.send('Stacy, Kara, Lumen');
});

router.get('/pumpedupkicks', function(req,res){
	res.send('All the other kids, with their pumped up kicks better run, better run');
});

module.exports = router;
