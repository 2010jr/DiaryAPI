const MongoClient = require('mongodb').MongoClient;
const log = require('../log/logger');
const mongoParam = require('./mongo_param.json');

class Db {
  static createDbPromise(url = mongoParam.url, options = mongoParam) {
    return MongoClient.connect(url, options);
  }

  constructor(dbPromise) {
    this.dbPromise = dbPromise;
    this.logLabel = { label: 'db' };
    dbPromise.then((mongodb) => {
      log.info(`Successfully connected to mongodb:${mongodb.databaseName}`, this.logLabel);
    });
  }

  find(collectionName, criteria) {
    return this.dbPromise
      .then(db => db.collection(collectionName).find(criteria).toArray())
      .catch((error) => {
        log.error(`Failed to find in collection name:${collectionName} and criteria:${criteria}`, this.logLabel);
        log.error(`Reason : ${error.message}`);
        log.error(error.stack);
        Promise.reject(error);
      });
  }

  insert(collectionName, document) {
    this.dbPromise
      .then(db => db.collection(collectionName).insert(document))
      .catch((error) => {
        log.error(`Failed to insert document:${document} in collection:${collectionName}`, this.logLabel);
        log.error(`Reason : ${error.message}`, this.logLabel);
        log.error(error.stack);
        Promise.reject(error);
      });
  }

  deleteMany(collectionName, criteria, options) {
    this.dbPromise
      .then(db => db.collection(collectionName).deleteMany(criteria, options));
  }

  update(collectionName, criteria, document, options) {
    this.dbPromise
      .then(db => db.collection(collectionName).update(criteria, document, options));
  }
}

module.exports = { Db };
