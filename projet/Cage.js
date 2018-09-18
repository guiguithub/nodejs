//Cage


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

// CAGE

//READ ALL CAGES
   router.get('/', function(req, res) {
  	console.log('READ ALL CAGES');
    var query = "SELECT * FROM Cage";

//filtre condition
    var conditions = ["id","name","description","height"];
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

//READ 1 Cage
   router.get('/:id(\\d+)', function(req, res) {
  	console.log('READ 1 Cage');
  	var id = req.params.id;
    var query = "SELECT * FROM Cage where id = "+ id;
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
	});

 });

//ADD 1 Cage
   router.post('/', function(req, res) {
  	console.log('ADD 1 Cage');
  	var name = req.body.name;
  	var description = req.body.description;
  	var height = req.body.height;
    var query = "INSERT INTO Cage (name,description,height) values ('"+name+"','"+description+"','"+height+"'"+")";
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify("Succes line added"));
		console.log('ADDED 1 Cage');
	});

 });

//UPDATE 1 Cage
   router.put('/:id(\\d+)', function(req, res) {
  	console.log('UPDATE 1 Cage');
  	var id = req.params.id;
    var query = "UPDATE Cage SET ";
   // var DB_fields = ['name','description','height'];
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


//DELETE 1 Cage
   router.delete('/:id(\\d+)', function(req, res) {
  	console.log('DELETE 1 Cage');
  	var id = req.params.id;
    var query = "DELETE FROM Cage where id =" + id;
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
		console.log('DELETED 1 Cage');
	});

 });


//DELETE ALL CageS
   router.delete('/', function(req, res) {
  	console.log('DELETE ALL CageS');
    var query = "DELETE FROM Cage";
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
		console.log('DELETED ALL CageS');
	});

 });



//Cages-animals
   router.get('/:id(\\d+)/animals', function(req, res) {
  	console.log('Cages animals');
  	var id = req.params.id;
    var query = "SELECT cage.id cage_id,cage.name cage_name,cage.description,animal.id animal_id,animal.NAME animal_name,animal.race,animal.born,animal.entrance from Cage INNER JOIN animal on cage.id=animal.cage_id where cage.id ="+id;
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
	});

 });

   router.get('/:id_cage(\\d+)/animals/:id_animal(\\d+)', function(req, res) {
  	console.log('Cages animals');
  	var id_cage = req.params.id_cage;
  	var id_animal = req.params.id_animal;
    var query = "SELECT cage.id cage_id,cage.name cage_name,cage.description,animal.id animal_id,animal.NAME animal_name,animal.race,animal.born,animal.entrance from Cage INNER JOIN animal on cage.id=animal.cage_id where cage.id ="+id_cage+" AND animal.id="+id_animal;
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
	});

 });




   module.exports = router;