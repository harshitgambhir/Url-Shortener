const MongoClient = require('mongodb').MongoClient;
let state = {
    db: null,
}

exports.connect = (url, done) => {
    if (state.db) return done();
  
    MongoClient.connect(url, (err, client) => {
      if (err) return done(err);
      state.db = client.db('urls');
      done();
    })
}

exports.get = () => {
    return state.db;
}

exports.close = (done) => {
    if (state.db) {
      state.db.close((err, result) => {
        state.db = null;
        state.mode = null;
        done(err);
      })
    }
  }