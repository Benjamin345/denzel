const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const imdb = require('./imdb');

const CONNECTION_URL = "mongodb+srv://bcharpen:ben877777@nosql-y5ghg.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "Denzel";


async function connect(){
	var app = Express();

	app.use(BodyParser.json());
	app.use(BodyParser.urlencoded({ extended: true }));

	var database, collection;

	MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
	    if(error) {
	        throw error;
	    }
	    database = client.db(DATABASE_NAME);
	    collection = database.collection("Denzel_movies");
	    console.log("Connected to `" + DATABASE_NAME + "`!");

	    //Populate the database with all the Denzel's movies from IMDb
	    app.get('/movies/populate',async function(req,res){
	    	const movies = await imdb("nm0000243");
			movies.forEach(function(movie,i){
		    	collection.insert(movie);
		    })
	    	res.send("done");
	    })

	    //Fetch a random must-watch movie
	    app.get('/movies',async function(req,res){
	    	res.send(await collection.findOne({"metascore":{$gt:70}}));
	    });

	    //Search for Denzel's movies.
	    app.get('/movies/search',async function(req,res){
	   	if(req.query){
	    	if (!req.query.limit && req.query.metascore)
	    		res.send(await collection.find({"metascore":{$gte:parseInt(req.query.metascore)}}).limit(5).sort( { "metascore": 1 } ).toArray());
	    	else if (req.query.limit && !req.query.metascore)
	    		res.send(await collection.find({"metascore":{$gte:0}}).limit(parseInt(req.query.limit)).sort( { "metascore": 1 } ).toArray());
	    	else if (req.query.limit && req.query.metascore)
	    		res.send(await collection.find({"metascore":{$gte:parseInt(req.query.metascore)}}).limit(parseInt(req.query.limit)).sort( { "metascore": 1 } ).toArray());
	    }
	    else
	    	res.send(await collection.find({"metascore":{$gte:0}}).limit(5).sort( { "metascore": 1 } ).toArray());
	    });

	    
	    //Save a watched date and a review
	    app.post('/movies/:id',async function(req,res){
	    	if(req.query.date && req.query.review)
	    		res.send(await collection.updateOne({ "id": req.params.id },{ $set:{"date": req.query.date,"review":req.query.review}}));
	    	else 
	    		res.send("Invalid queries parameters (date AND review)")

	    });

	    //Fetch a specific movie.
	    app.get('/movies/:id',async function(req,res){
	    	console.log(await collection.findOne({"id":req.params.id}));
	    	res.send(await collection.findOne({"id":req.params.id}));
	    });

	});
	app.listen(9292);
}	

connect();
