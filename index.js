const express = require('express');
const app = express();
require('dotenv').config();
const routes = require('./routes/routes');
const db = require('./db/db');
const dblink = process.env.DB_LINK;
db.connect(dblink, (err) => {
  if (err) {
    console.log('Unable to connect')
    process.exit(1)
  } else {
    console.log('connected')
    app.listen(process.env.port || 3000);
  }
})

app.use(routes);