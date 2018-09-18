//Animal

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

// ANIMAL

//READ ALL ANIMALS
   router.get('/', function(req, res) {
  	console.log('READ ALL ANIMALS');
    var query = "SELECT * FROM Animal";

//filtre condition
	var conditions = ["id","name","race","food_per_day","born","entrance","cage_id"];
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

//READ 1 ANIMAL
   router.get('/:id(\\d+)', function(req, res) {
  	console.log('READ 1 ANIMAL');
  	var id = req.params.id;
    var query = "SELECT * FROM Animal where id = "+ id;
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
	});

 });

//ADD 1 ANIMAL
   router.post('/', function(req, res) {
  	console.log('ADD 1 ANIMAL');
  	var name = req.body.name;
  	var race = req.body.race;
  	var food_per_day = req.body.food_per_day;
  	var born = req.body.born;
  	var entrance = req.body.entrance;
  	var cage_id = req.body.cage_id;
    var query = "INSERT INTO Animal (name,race,food_per_day,born,entrance,cage_id) values ('"+name+"','"+race+"','"+food_per_day+"','"+born+"','"+entrance+"',"+cage_id+")";
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify("Succes line added"));
		console.log('ADDED 1 ANIMAL');
	});

 });

//UPDATE 1 ANIMAL
   router.put('/:id(\\d+)', function(req, res) {
  	console.log('UPDATE 1 ANIMAL');
  	var id = req.params.id;
    var query = "UPDATE Animal SET ";
   // var DB_fields = ['name','race','food_per_day','born','entrance','cage_id'];
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


//DELETE 1 ANIMAL
   router.delete('/:id(\\d+)', function(req, res) {
  	console.log('DELETE 1 ANIMAL');
  	var id = req.params.id;
    var query = "DELETE FROM Animal where id =" + id;
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
		console.log('DELETED 1 ANIMAL');
	});

 });


//DELETE ALL ANIMALS
   router.delete('/', function(req, res) {
  	console.log('DELETE ALL ANIMALS');
    var query = "DELETE FROM Animal";
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
		console.log('DELETED ALL ANIMALS');
	});

 });


//Animals-Cages
   router.get('/:id(\\d+)/cages', function(req, res) {
  	console.log('animals Cages');
  	var id = req.params.id;
    var query = "SELECT cage.id cage_id,cage.name cage_name,cage.description,animal.id animal_id,animal.NAME animal_name,animal.race,animal.born,animal.entrance from animal INNER JOIN cage on animal.cage_id=cage.id where animal.id ="+id;
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
	});

 });

   router.get('/:id_animal(\\d+)/cages/:id_cage(\\d+)', function(req, res) {
  	console.log('animals Cages');
  	var id_cage = req.params.id_cage;
  	var id_animal = req.params.id_animal;
    var query = "SELECT cage.id cage_id,cage.name cage_name,cage.description,animal.id animal_id,animal.NAME animal_name,animal.race,animal.born,animal.entrance from animal INNER JOIN cage on animal.cage_id=cage.id where animal.id ="+id_animal+" AND cage.id="+id_cage;
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
	});

 });




//animals-Foods
   router.get('/:id(\\d+)/foods', function(req, res) {
  	console.log('animals Food');
  	var id = req.params.id;
    var query = "SELECT food.id, animal.name animal_name,animal.race,food.name food_name,food.animal id_animal,food.quantity from animal INNER JOIN food on animal.id=food.animal where animal.id = "+id;
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
	});

 });

   router.get('/:id_animal(\\d+)/foods/:id_food(\\d+)', function(req, res) {
  	console.log('animals Food');
  	var id_food = req.params.id_food;
  	var id_animal = req.params.id_animal;
    var query = "SELECT food.id, animal.name animal_name,animal.race,food.name food_name,food.animal id_animal,food.quantity from animal INNER JOIN food on animal.id=food.animal where animal.id="+id_animal+" AND food.id="+id_food;
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
	});

 });



   module.exports = router;
