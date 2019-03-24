const{ graphql,GraphQLSchema,GraphQLObjectType, GraphQLString,buildSchema} =require('graphql');
const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const imdb = require('./imdb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const graphqlHTTP = require('express-graphql');

const {movieType} = require('./type.js');


const CONNECTION_URL = "mongodb+srv://bcharpen:ben877777@nosql-y5ghg.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "Denzel";
const GadgetSchema = new Schema({
  _id: String,
  link: String,
  id: String,
  metascore: Number,
  poster:String,
  rating:Number,
  synopsis:String,
  title:String,
  votes:Number,
  year:Number
});

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
	    const queryType = new GraphQLObjectType({
		    name: 'populate',
		    fields: {
		        movie: {
		            resolve:async function (source, args) {
		                const movies = await imdb("nm0000243");
		                database.collection.insertMany(movies);
		                return movies;
		            }
		        }
		    }
		});
		app.use('/graphql', graphqlHTTP({
		    schema: queryType,
		    graphiql: true,
		}));

	});
	
	app.listen(9292);
}

connect();