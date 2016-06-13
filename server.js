var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var DataStore = require('nedb');

var port = (process.env.PORT || 10000);

var app = express();

var dbFileName  = path.join(__dirname,'products.json');
var db = new DataStore({
		filename : dbFileName,
		autoload: true
	});

console.log('DB initialized');

db.find({},function (err,products){

	if(products.length == 0){
		console.log('Empty DB, loading initial data');

		product1 = {
			name : 'Producto ejemplo 1',
			description : 'este producto sirve para ...',
			code: '8576655'
		};

		product2 = {
			name : 'Producto ejemplo 2',
			description : 'este producto sirve para ...',
			code: '8576655'
		};

		db.insert([product1, product2]);

	}else{
		console.log('DB has '+products.length+' products ');
	}

});

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());

app.get('/products',function(req,res){
	console.log('New GET request');

	db.find({},function (err,products){
		res.json(products);
	});
});

app.post('/products',function(req,res){
	console.log('New POST request');
	console.log(req.body);
	db.insert(req.body);
	res.sendStatus(200);
});

app.get('/products/:name',function(req,res){
	var n = req.params.name;
	//console.log('New GET request for product with name '+n);

	db.find({ name : n},function (err,products){
		console.log("products obtained: "+products.length);
		if(products.length  > 0){
			res.send(products[0]);
		}else{
			res.sendStatus(404);
		}
	});
});

app.delete('/products/:name',function(req,res){
	var n = req.params.name;
	console.log('New DELETE request for product with name '+n);

	db.remove({ name: n},{}, function(err,numRemoved){
		console.log("products removed: "+numRemoved);
		if(numRemoved  == 1)
			res.sendStatus(200);
		else
			res.sendStatus(404);
	});
});

app.listen(port);
console.log('Magic is happening on port '+port);
