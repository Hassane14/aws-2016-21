var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var DataStore = require('nedb');

var port = (process.env.PORT || 10000);

var app = express();

var dbFileName  = path.join(__dirname,'contacts.json');
var db = new DataStore({
		filename : dbFileName,
		autoload: true
	});

console.log('DB initialized');

db.find({},function (err,contacts){

	if(contacts.length == 0){
		console.log('Empty DB, loading initial data');

		person1 = {
			name : 'Pablo',
			email : 'pafmon@gmail.com',
			number: '682 123 123'
		};

		person2 = {
			name : 'Pedro',
			email : 'pedro@gmail.com',
			number: '682 122 126'
		};

		db.insert([person1, person2]);

	}else{
		console.log('DB has '+contacts.length+' contacts ');
	}

});

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());

app.get('/contacts',function(req,res){
	console.log('New GET request');

	db.find({},function (err,contacts){
		res.json(contacts);
	});
});

app.post('/contacts',function(req,res){
	console.log('New POST request');
	console.log(req.body);
	db.insert(req.body);
	res.sendStatus(200);
});

app.get('/contacts/:name',function(req,res){
	var n = req.params.name;
	console.log('New GET request for contact with name '+n);

	db.find({ name : n},function (err,contacts){
		console.log("Contacts obtained: "+contacts.length);
		if(contacts.length  > 0){
			res.send(contacts[0]);
		}else{
			res.sendStatus(404);
		}
	});
});

app.delete('/contacts/:name',function(req,res){
	var n = req.params.name;
	console.log('New DELETE request for contact with name '+n);

	db.remove({ name: n},{}, function(err,numRemoved){
		console.log("Contacts removed: "+numRemoved);
		if(numRemoved  == 1)
			res.sendStatus(200);
		else
			res.sendStatus(404);
	});
});

app.listen(port);
console.log('Magic is happening on port '+port);
