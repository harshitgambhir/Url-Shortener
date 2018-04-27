const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
} = require('graphql');

const createShortUrl = require('./createShortUrl');
const getUrls = require('./getUrls');
const getLongUrls = require('./getLongUrls');

const rootQuery = new GraphQLObjectType({
    name: "rootQuery",
    fields: () => ({
        getUrls: getUrls,
        getLongUrls: getLongUrls
    })
});

const mutation = new GraphQLObjectType({
    name: "mutation",
    fields: () => ({
        createShortUrl: createShortUrl
    })
});

const schema = new GraphQLSchema({
    query: rootQuery,
    mutation: mutation,
})

module.exports = schema;