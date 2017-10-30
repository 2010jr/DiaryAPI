var db;
const MongoClient = require('mongodb').MongoClient,
	assert = require('assert');
const MongoParam = require('./mongo_param.json');


MongoClient.connect(MongoParam.url, MongoParam, function (err, mongodb) {
  console.log(err);
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

function update(collect_name, criteria, document, options, callback) {
	console.log("update invoked");
	db.collection(collect_name, function(outer_err, collection) {
		collection.update(criteria, document, options, function(inner_err, result) {
				if(null != inner_err) {
						console.log(inner_err);
				}
				callback(result);
		});
	});
}

function deleteMany(collect_name, criteria, options, callback) {
	console.log("delete invoked");
	db.collection(collect_name, function(outer_err, collection) {
			collection.deleteMany(criteria, options, function(inner_err, result) {
					callback(result);
			});
	});
}

module.exports = {
  find: find,
  insert: insert,
  update: update,
  deleteMany: deleteMany
}
