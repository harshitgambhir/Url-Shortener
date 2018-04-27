const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
    GraphQLError
} = require('graphql');

const urlType = exports.urlType = new GraphQLObjectType({
    name: "urlType",
    fields: () => ({
        _id: {type: GraphQLString},
        short_url: {type: GraphQLString},
        long_url: {type: GraphQLString},
        success: {type: GraphQLBoolean},
        count: {type: GraphQLInt},
        urls: {type: new GraphQLList(urlType)},
        long_urls: {type: new GraphQLList(GraphQLString)}
    })
})