var express = require('express'),
	app = express(),
	path = require('path'),
	MongoClient = require('mongodb').MongoClient, 
	Server = require('mongodb').Server;


app.use( '/', express.static(path.join(__dirname , '..', 'web_app')));


// Define index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
	console.log("File sent to client");
});


//set up MongoDB server port
var url = "mongodb://localhost:27017";

//route the given url to get corresponding 

app.get('/render' , (req, res) => {
	var query = JSON.parse(decodeURIComponent(req._parsedUrl.query))
	//console.log(query);
	MongoClient.connect(url, (err, db) =>{
	    db.db("aero").collection('same_day').find({"availability":new RegExp(query)}).toArray(function(err, result) {
	    	//console.log(query)
	        //console.log(result[0])
	        res.send(result);
	    });
	});
});


app.get('/dates' , (req, res) => {
	MongoClient.connect(url, (err, db) =>{
	    db.db("aero").collection('same_day').distinct("availability" , function(err, result) {
	    	res.send(result.map(date => date.split("/")[0]));
		});
	});
});

//"cartographicDegrees" : [ -118.6357157, 33.6374607, 0.5 ]

app.get('/voxel' , (req, res) => {
	var query = JSON.parse(decodeURIComponent(req._parsedUrl.query))
	var regex = /[+-]?\d+(\.\d+)?/g;
	var floats = query.match(regex).map(function(v) { return parseFloat(v); });
	//console.log(floats.slice(0, 3));
	MongoClient.connect(url, (err, db) =>{
	    db.db("aero").collection('same_day').find({"position.cartographicDegrees":floats.slice(0, 3)}, {"availability":1, "box.material.solidColor.color.rgba":1}).toArray(function(err, result) {
	    	//console.log({"position":{"cartographicDegrees":floats.slice(0, 3)}})
	    	
	    	console.log(floats.slice(0, 3))
	    	console.log(result);
	    	labels = result.map(x => x["availability"].split("/")[0]);
	    	colors = result.map(x => x["box"]["material"]["solidColor"]["color"]["rgba"]);
	    	res.send([labels, colors]);
		});
	});
});

// Set up port 3001
app.listen(3001, () => console.log('Navigate to http://localhost:3001'));