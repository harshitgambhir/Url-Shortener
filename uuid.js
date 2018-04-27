const crypto = require('crypto');
const util = require('util');
const cryptoRandomBytes = util.promisify(crypto.randomBytes).bind(crypto);
const base64url = require('base64url');
const uuid = () => {
    return new Promise(async(resolve, reject)=> {
        try{
            resolve(base64url(await cryptoRandomBytes(6)));
        } catch(error){
            reject(error);
        }
    })
}

module.exports = uuid;