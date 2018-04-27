const routes = require('express').Router();
const expressGraphQl = require('express-graphql');
const schema = require('../graphql/schema');
const redirect = require('../redirect');
const cors = require('cors');

routes.use(cors());

routes.use('/api', expressGraphQl((req,res) => ({
    schema: schema,
    graphiql: true,
    context: { req: req, res: res },
    formatError: error => ({
        state: error.originalError && error.originalError.state
    }, console.log(error)),
})));

routes.get('/:short_url_id', redirect);

module.exports = routes;