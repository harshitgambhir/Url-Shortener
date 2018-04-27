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
const url = require('url');

const getLongUrls = {
    type: urlType,
    args: {
        short_urls: {type: new GraphQLNonNull( new GraphQLList(GraphQLString))}
    },
    resolve: async (parentValue, args) => {
        let errors = [];
        let parsedShortUrlIds = [];
        const short_urls = args.short_urls;
        if(short_urls.length === 0){
            errors.push({ key: 'short_urls', message: "Please enter a short url."});
        } else {
            for (let i = 0; i < short_urls.length; i++) {
                if(isEmpty(short_urls[i])){
                    errors.push({ key: 'short_urls', message: "403 BAD REQUEST ERROR"});
                    i=short_urls.length;
                } else if(!isUrl(short_urls[i], {
                    protocols: ['http','https'],
                    require_tld: false,
                    require_protocol: true,
                    require_host: true,
                    require_valid_protocol: true,
                    allow_underscores: true,
                    allow_protocol_relative_urls: false
                })){
                    errors.push({ key: 'short_urls', message: "403 BAD REQUEST ERROR"});
                    i=short_urls.length;
                } else {
                    let parsed = url.parse(short_urls[i]);
                    if(parsed.hostname !== process.env.HOSTNAME){
                        errors.push({ key: 'short_urls', message: "403 BAD REQUEST ERROR"});
                        i=short_urls.length;
                    } else {
                        parsedShortUrlIds.push(parsed.pathname.substring(1));
                    }
                }
            }
        }
        if (errors.length) throw new ValidationError(errors);
        
        return await getLongUrlsFunction(args, parsedShortUrlIds);
    }
}

const getLongUrlsFunction = async (args, parsedShortUrlIds) => {
    let result =[];
    for(let i=0; i<parsedShortUrlIds.length; i++){
        let url = await db.get().collection('urls').findOne({_id: parsedShortUrlIds[i]});
        if(url){
            result.push(url.long_url);
        } else {
            result.push(null);
        }
    }
    return {long_urls: result}
}

module.exports = getLongUrls;