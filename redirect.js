const isLength = require('validator/lib/isLength');
const db = require('./db/db');
const redirect = async (req, res, next) => {
    const short_url_id = req.params.short_url_id;
    if(!isLength(short_url_id, {min: 8, max:8})){
        return res.send("<div>404</div>");
    }
    try{
        const result = await db.get().collection('urls').findOneAndUpdate({_id: short_url_id}, {$inc: {count: 1},}, {returnOriginal: true});
        if(!result.value){
            return res.send("<div>404</div>");
        }
        res.redirect(301,result.value.long_url);
    } catch(error){

    }
}

module.exports = redirect;