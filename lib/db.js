const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_URL || require('../config/local').mongodb.url;
var client;

module.exports = {
  get client() {
    if (client) return Promise.resolve(client);
    else return MongoClient.connect(url).then(c => client = c);
  },
  get diary () {
    return module.exports.client.then(c => c.db('diary'));
  },
  getCol(col) {
    return module.exports.diary.then(diary => diary.collection(col));
  },
  getEntry: async function(opts, limit) {
    return (await module.exports.getCol("entry")).find(opts, { limit, sort:{ "createdAt":-1} }).toArray();
  },
  postEntry: async function(data) {
    data.createdAt = new Date();
    return (await module.exports.getCol("entry")).insertOne(data);
  },
};
