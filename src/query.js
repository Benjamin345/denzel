const { GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    graphqlID
} = require('graphql');

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const {movieType} = require('./type.js');
const _ = require('lodash');


//Define the Query
const queryType = new GraphQLObjectType({
    name: 'movies',
    fields: {
        movie: {
            type: movieType,
            args:{id:{type:graphqlID}},
            resolve:async function (source, args) {
                const movies = await imdb("nm0000243");
                return _.find(movies,{id:args.id});
            }
        }
    }
});

exports.queryType = queryType;
