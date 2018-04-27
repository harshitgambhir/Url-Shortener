const urlType = require('./types').urlType;
const isEmpty = require('validator/lib/isEmpty');
const isUrl = require('validator/lib/isURL');
const ValidationError = require('../ValidationError');
const uuid = require('../uuid');
const db = require('../db/db');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLList
} = require('graphql');

const getUrls = {
    type: urlType,
    resolve: async (parentValue, args) => {
        return await getUrlsFunction(args);
    }
}

const getUrlsFunction = async (args) => {
    const result = await db.get().collection('urls').find({}).toArray();
    const mapped = result.map((url) => {
        url._id = `${process.env.DOMAIN}/${url._id}`;
        return url;
    })
    return {urls: mapped}
}

module.exports = getUrls;