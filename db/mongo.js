const MongoClient = require('mongodb').MongoClient;
const log = require('../log/logger');
const mongoParam = require('./mongo_param.json');

class Db {
  constructor(url = mongoParam.url, options = mongoParam) {
    new Promise((resolve, reject) => {
      MongoClient.connect(url, options, (err, mongodb) => {
        if (err) {
          reject(err);
        } else {
          resolve(mongodb);
        }
      });
    }).then((mongodb) => {
      log.info(`Successfully connected to mongodb:${mongodb.databaseName}`);
      this.db = mongodb;
    }, (err) => {
      const serializedErr = JSON.stringify(err);
      log.error(`Failed to connect to MongoDB. Error:${serializedErr}`);
      log.error(err.stack);
    }).catch((reason) => {
      log.error('Error some thing happened during db connection');
      log.error(reason);
    });
  }

  find(collectionName, criteria, projection, callback) {
    // TODO: Error handling should be added
    this.db.collection(collectionName, (outerErr, collection) => {
      collection.find(criteria, projection).toArray((innerErr, list) => {
        callback(list);
      });
    });
  }
  insert(collectName, document, options, callback) {
    this.db.collection(collectName, (outerErr, collection) => {
      collection.insert(document, (innerErr, result) => {
        callback(result);
      });
    });
  }
  deleteMany(collectName, criteria, options, callback) {
    this.db.collection(collectName, (outerErr, collection) => {
      collection.deleteMany(criteria, options, (innerErr, result) => {
        callback(result);
      });
    });
  }
  update(collectName, criteria, document, options, callback) {
    this.db.collection(collectName, (outerErr, collection) => {
      collection.update(criteria, document, options, (innerErr, result) => {
        callback(result);
      });
    });
  }
}

module.exports = { Db };
