//Staff


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

// Staff

//READ ALL StaffS
   router.get('/', function(req, res) {
  	console.log('READ ALL StaffS');
    var query = "SELECT * FROM Staff";	

//filtre condition
    var conditions = ["id","first_name","name","salary"];
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

//READ 1 Staff
   router.get('/:id(\\d+)', function(req, res) {
  	console.log('READ 1 Staff');
  	var id = req.params.id;
    var query = "SELECT * FROM Staff where id = "+ id;
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
	});

 });

//ADD 1 Staff
   router.post('/', function(req, res) {
  	console.log('ADD 1 Staff');
  	var first_name = req.body.first_name;
  	var name = req.body.name;
  	var salary = req.body.salary;
    var query = "INSERT INTO Staff (first_name,name,salary) values ('"+first_name+"','"+name+"','"+salary+"'"+")";
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify("Succes line added"));
		console.log('ADDED 1 Staff');
	});

 });

//UPDATE 1 Staff
   router.put('/:id(\\d+)', function(req, res) {
  	console.log('UPDATE 1 Staff');
  	var id = req.params.id;
    var query = "UPDATE Staff SET ";
   // var DB_fields = ['first_name','name','salary'];
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


//DELETE 1 Staff
   router.delete('/:id(\\d+)', function(req, res) {
  	console.log('DELETE 1 Staff');
  	var id = req.params.id;
    var query = "DELETE FROM Staff where id =" + id;
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
		console.log('DELETED 1 Staff');
	});

 });


//DELETE ALL StaffS
   router.delete('/', function(req, res) {
  	console.log('DELETE ALL StaffS');
    var query = "DELETE FROM Staff";
	
	db.query(query, function(err, result, fields) {
		if(err) throw err;
		res.send(JSON.stringify(result));
		console.log('DELETED ALL StaffS');
	});

 });


   module.exports = router;