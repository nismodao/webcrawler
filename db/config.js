var MongoClient = require('mongodb').MongoClient;
var Promise = require('bluebird');
var mongoose = require('mongoose');
Promise.promisifyAll(mongoose);
var findOrCreate = require('mongoose-findorcreate');
require('dotenv').config();
var MONGODB_URI = process.env.MONGODB_URI;
var db;

mongoose.connect(MONGODB_URI, 
  function (err, database) {
  if (err) {
    console.log('error from db connection', err);
    process.exit(1);
  } else {
  db = database;
  console.log("Database connection ready");
  }
});

var Schema = mongoose.Schema;

var urlSchema = new Schema({
  url: String,
  inProgress: Boolean,
  html: String
}, {timestamps: true});

urlSchema.plugin(findOrCreate);

var Url = mongoose.model('Url', urlSchema);

module.exports.Url = Url;