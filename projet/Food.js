//Food


 const express = require('express');
 const mysql = require('mysql');
 const bodyParser = require('body-parser');
 const router = express();
 var constants = require('./constants');

 
  var db = mysql.createConnection({
		host: constants.HOST,
		user: constants.USER,
		password: constants.PASSWORD,
		database: constants.DATABASE
	
 });

// Food

//READ ALL FoodS
   router.get('/', function(req, res) {
  	console.log('READ ALL FoodS');
    var query = "SELECT * FROM Food";	

//filtre condition
    var conditions = ["id","name","animal","quantity"];
	var my_fields = [];

	for(var index in conditions){
		if (conditions[index] in req.query) {
			if(query.indexOf("WHERE") < 0) {
				query +=" WHERE ";
			}
			my_fields.push(conditions[index] + "='"+req.query[conditions[index]] +"'");
		}
	}

	query +=my_fields.join(' AND ');


//filtre ordre
if("sort" in req.query){
	var sort = req.query["sort"].split(",");
	query += " ORDER BY";

	for(var index in sort){
		var direction = sort[index].substr(0,1);
		var field = sort[index].substr(1);

		query += " " + field;

		if (direction == "-") 
			query += " DESC,";
		else
			query += " ASC,";
	}
	query = query.slice(0, -1);
}

//filtre champs

if("fields" in req.query) {
	query = query.replace("*", req.query["fields"]);
}

//filtre pagination

if("limit" in  req.query) {
	query += " LIMIT " + req.query["limit"];
	if("offset" in req.query) {
		query += " OFFSET " + req.query["offset"];
	}
}
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
	});

 });

//READ 1 Food
   router.get('/:id(\\d+)', function(req, res) {
  	console.log('READ 1 Food');
  	var id = req.params.id;
    var query = "SELECT * FROM Food where id = "+ id;
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
	});

 });

//ADD 1 Food
   router.post('/', function(req, res) {
  	console.log('ADD 1 Food');
  	var name = req.body.name;
  	var animal = req.body.animal;
  	var quantity = req.body.quantity;
    var query = "INSERT INTO Food (name,animal,quantity) values ('"+name+"','"+animal+"','"+quantity+"'"+")";
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify("Succes line added"));
		console.log('ADDED 1 Food');
	});

 });

//UPDATE 1 Food
   router.put('/:id(\\d+)', function(req, res) {
  	console.log('UPDATE 1 Food');
  	var id = req.params.id;
    var query = "UPDATE Food SET ";
   // var DB_fields = ['name','animal','quantity'];
    var my_fields = [];

    for(let i=0; i < Object.keys(req.body).length; i++){
    	my_fields[i]=(Object.keys(req.body)[i]+"="+"'"+Object.values(req.body)[i]+"'");
    }

    query += my_fields.join();
    query += " WHERE id="+id;

	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
	});

 });


//DELETE 1 Food
   router.delete('/:id(\\d+)', function(req, res) {
  	console.log('DELETE 1 Food');
  	var id = req.params.id;
    var query = "DELETE FROM Food where id =" + id;
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
		console.log('DELETED 1 Food');
	});

 });


//DELETE ALL FoodS
   router.delete('/', function(req, res) {
  	console.log('DELETE ALL FoodS');
    var query = "DELETE FROM Food";
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
		console.log('DELETED ALL FoodS');
	});

 });


//FOOD Stat
   router.get('/food-stats', function(req, res) {
  	console.log('Food quantity');
    var query = "SELECT animal.name,animal.food_per_day, food.quantity,round(food.quantity/animal.food_per_day) Days_Left FROM Food join Animal on Animal.id=Food.id";
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
	});

 });


//Foods-animals
   router.get('/:id(\\d+)/animals', function(req, res) {
  	console.log('Food animals');
  	var id = req.params.id;
    var query = "SELECT food.id, animal.name animal_name,animal.race,food.name food_name,food.animal id_animal,food.quantity FROM food INNER JOIN animal on food.animal=animal.id where food.id = "+id;
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
	});

 });

   router.get('/:id_food(\\d+)/animals/:id_animal(\\d+)', function(req, res) {
  	console.log('Food animals');
  	var id_food = req.params.id_food;
  	var id_animal = req.params.id_animal;
    var query = "SELECT food.id, animal.name animal_name,animal.race,food.name food_name,food.animal id_animal,food.quantity FROM food INNER JOIN animal on food.animal=animal.id where food.id = "+id_food+" AND animal.id="+id_animal;
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
	});

 });




   module.exports = router;