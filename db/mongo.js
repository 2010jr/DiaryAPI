const MongoClient = require('mongodb').MongoClient;
const log = require('../log/logger').createLogger('db');
const mongoParam = require('./mongo_param.json');

class Db {
  static createDbPromise(url = mongoParam.url, options = mongoParam) {
    return MongoClient.connect(url, options);
  }

  constructor(dbPromise) {
    this.dbPromise = dbPromise;
    this.dbPromise.then((mongodb) => {
      log.info(`Successfully connected to mongodb:${mongodb.databaseName}`);
    });
  }

  find(collectionName, criteria) {
    return this.dbPromise
      .then((db) => {
        log.info(`Find by criteria:${criteria} in collection:${collectionName}`);
        return db.collection(collectionName).find(criteria).toArray();
      })
      .catch((error) => {
        log.error(`Failed to find in collection name:${collectionName} and criteria:${criteria}`);
        log.error(`Reason : ${error.message}`);
        log.error(error.stack);
        Promise.reject(error);
      });
  }

  insert(collectionName, document) {
    this.dbPromise
      .then((db) => {
        log.info(`Insert document:${document} to collection:${collectionName}`);
        return db.collection(collectionName).insert(document);
      })
      .catch((error) => {
        log.error(`Failed to insert document:${document} in collection:${collectionName}`);
        log.error(`Reason : ${error.message}`, this.logLabel);
        log.error(error.stack, this.logLabel);
        Promise.reject(error);
      });
  }

  deleteMany(collectionName, criteria, options) {
    this.dbPromise
      .then((db) => {
        log.info(`Delete document by criteria ${criteria} to collection:${collectionName}`);
        return db.collection(collectionName).deleteMany(criteria, options);
      })
      .catch((error) => {
        log.error(`Failed to delete document by criteria:${criteria} in collection:${collectionName}`);
        log.error(`Reason : ${error.message}`, this.logLabel);
        log.error(error.stack, this.logLabel);
        Promise.reject(error);
      });
  }

  update(collectionName, criteria, document, options) {
    this.dbPromise
      .then((db) => {
        log.info(`Update document:${document} by criteria ${criteria} in collection:${collectionName}`);
        return db.collection(collectionName).update(criteria, document, options);
      })
      .catch((error) => {
        log.error(`Failed to update document:${document} by criteria:${criteria} in collection:${collectionName}`);
        log.error(`Reason : ${error.message}`, this.logLabel);
        log.error(error.stack, this.logLabel);
        Promise.reject(error);
      });
  }
}

module.exports = { Db };
