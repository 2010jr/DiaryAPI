'use strict';

var db;
var mongo_client = require('mongodb').MongoClient
var assert = require('assert');

var url = 'mongodb://localhost:27017';

mongo_client.connect(url, function(err, mongodb) {
 assert.equal(null, err);
 console.log("Connected correctly to server: " + mongodb);
 db = mongodb;
});

function find(collect_name, criteria, projection, callback) {
	console.log(criteria);
	db.collection(collect_name, function(outer_err, collection) {
		collection.find(criteria, projection).toArray(function(inner_err, list) {
			callback(list);
		});
	});
}

function insert(collect_name, document, options, callback) {
	db.collection(collect_name, function(outer_err, collection) {
		console.log(document);
		collection.insert(document, function(inner_err, result) {
			callback(result);
		});
	});
}	

module.exports = {
	find: find,
	insert: insert
}
