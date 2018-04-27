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

const createShortUrl = {
    type: urlType,
    args: {
        long_urls: {type: new GraphQLNonNull( new GraphQLList(GraphQLString))}
    },
    resolve: async (parentValue, args) => {
        let errors = [];
        const long_urls = args.long_urls;
        if(long_urls.length === 0){
            errors.push({ key: 'long_urls', message: "Please enter a url."});
        } else {
            for (let i = 0; i < long_urls.length; i++) {
                if(isEmpty(long_urls[i])){
                    errors.push({ key: 'long_urls', message: "Please enter a url."});
                } else if(!isUrl(long_urls[i], {
                    protocols: ['http','https'],
                    require_tld: true,
                    require_protocol: true,
                    require_host: true,
                    require_valid_protocol: true,
                    allow_underscores: true,
                    allow_protocol_relative_urls: false
                })){
                    errors.push({ key: 'long_urls', message: "Please enter a valid url."});
                }
            }
        }
        if (errors.length) throw new ValidationError(errors);
        
        return await createShortUrlFunction(args);
    }
}

const createShortUrlFunction = async (args) => {
    const long_urls = args.long_urls;
    try{
        const collection = await db.get().listCollections().toArray();
        if(collection.length === 0){
            await db.get().createCollection('urls');
        } else if(!collection.includes('urls')){
            await db.get().createCollection('urls');
        }
        const dataToInsert = await Promise.all(long_urls.map(async (long_url) => {
            const result = {_id: await uuid(), long_url: long_url, count:0}
            return result;
        }));
        await db.get().collection('urls').insertMany(dataToInsert);
        return {success: true}
    } catch(error){
        console.log(error)
    }
}

module.exports = createShortUrl;