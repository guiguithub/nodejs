 const express = require('express');
 const mysql = require('mysql');
 const bodyParser = require('body-parser');
 const app = express();
 var animal = require('./Animal.js');
 var cage = require('./Cage.js');
 var food = require('./Food.js');
 var staff = require('./Staff.js');
 var constants = require('./constants');


 app.use(bodyParser.urlencoded({ extended: true}));
 
  var db = mysql.createConnection({
		host: constants.HOST,
		user: constants.USER,
		password: constants.PASSWORD,
		database: constants.DATABASE
	
 });
 
//Pare-feu
app.use((req,res,next) =>{
	if("key" in req.query){
		var key = req.query["key"];
		var query = "SELECT * FROM Zoo where apikey='"+ key +"'";
	db.query(query, (err, result, fields)=> {
		if(err) throw err;

		if(result.length > 0) {
			next();
		}
		else {
			res.send("Access denied");
		}
  
	});
	
	} else {
		res.send("Access denied");
	}


});

// HOME

   app.get('/api/v1/Zoo', function(req, res) {
   	console.log('home');
   	var response = {"page" : "home"};
	res.send(JSON.stringify(response));
	
 });


// ROUTES

app.use('/api/v1/Zoo/animals', animal);
app.use('/api/v1/Zoo/cages', cage);
app.use('/api/v1/Zoo/foods', food);
app.use('/api/v1/Zoo/staffs', staff);

 
 app.listen(3000, function() {
	 db.connect(function(err) {
		 if(err) throw err;
		 console.log('connection successful');
	 });

	 console.log('Example app listening port 3000');
 });