'use strict';
var router;

var mongo = require('./mongo');
var body_parser = require('body-parser');
var express = require('express');
var account = require('./account.json');

function extractUserName(req) {
	if (!req.headers.authorization) {
			return null;
	}
	var auth = req.headers.authorization.replace(/^Basic /, '');
	var loginInfo = (new Buffer(auth, 'base64')).toString('utf-8').split(':');
	return loginInfo[0];
}

function basicAuthenticate(req, res, next) {
	
	var auth,
	    login;
	
	if (!req.headers.authorization) {
		return authenticate(res);
	}
	
	console.log('req.headers.authorization:' + req.headers.authorization);
	auth = req.headers.authorization.replace(/^Basic /, '');
	auth = (new Buffer(auth, 'base64')).toString('utf-8');
	login = auth.split(':');

	if (account[login[0]] && account[login[0]] === login[1]) {
			next();
	} else {
			authenticate(res);
	}
}
		
function authenticate(res) {
		var realm = "Diary App";
		res.writeHead(401, {
				'WWW-Authenticate': 'Basic realm="' + realm + '"'
		});
		return res.end('Basic authorization');
}

router = function(app, server) {
	app.use(basicAuthenticate);
	app.use(body_parser.urlencoded({ extended: false }));
	app.use(body_parser.json());
	app.use(express.static(__dirname + '/public'));	
	
	app.all('/*', function(req, res, next) {
		res.contentType('json');
		res.header('Access-Control-Allow-Origin', '*');
		next();
	});
	app.get('/', function(req, res) {
		res.redirect('/index.html');
	});
	app.get('/:_diaryOrGoal(diary\|goal)?', function(req, res) {
		var criteria = { user : extractUserName(req)};
		for( var props in req.query) {
			if (req.query.hasOwnProperty(props)) {
				console.log(req.query[props]);
				criteria[props] = req.query[props];
			}
		}
		console.log("criteria : " + criteria);
		mongo.find(req.params._diaryOrGoal, criteria, {}, function(list) { res.json(list);});
	});	

	app.get('/:_diaryOrGoal(diary\|goal)/:_goalType(year\|quarter\|month\|week\|day)/:_date', function(req, res) {
		mongo.find(req.params._diaryOrGoal, { user: extractUserName(req) ,  type: req.params._goalType, date: req.params._date}, {}, 
			function(list) {
				res.json(list);
			}
		);
	});

	app.get('/:_diaryOrGoal(diary\|goal)/:_goalType(year\|quarter\|month\|week\|day)?', function(req,res) {
		console.log("get goal invoked");
		var criteria = { user : extractUserName(req), type: req.params._goalType };
		for( var props in req.query) {
			if (req.query.hasOwnProperty(props)) {
				console.log(req.query[props]);
				criteria[props] = req.query[props];
			}
		}
		mongo.find(req.params._diaryOrGoal, criteria , {}, 
			function(list) {
				res.json(list);
			}
		);
	});


	app.post('/diary', function(req, res) {
		var criteria = {
				user: extractUserName(req), 
				date: req.body.date
		};
		var data = req.body;
		data.user = extractUserName(req);

		mongo.update('diary', criteria, req.body, { upsert : true} , function(result) { res.send(result);});
	});

	
	app.post('/goal', function(req, res) {
		if (Array.isArray(req.body)) {
			    var	user = extractUserName(req);
				var ids = req.body.map(function(val) {return val._id;});
				var dataSet = req.body.map(function(val) { val.user = user; return val});

				mongo.deleteMany('goal', { _id : { $in : ids}}, function(result) {
						mongo.insert('goal', dataSet, {}, function(result) {
								res.send(result);
						});
				});
		} else {
				var criteria = {
						user: extractUserName(req), 
						date: req.body.date
				};
				var data = req.body;
				data.user = extractUserName(req);
				mongo.update('goal', criteria, data , { upsert : true}, function(result) { res.send(result);});
		}
	});
	
	app.delete('/:_diaryOrGoal(diary\|goal)', function(req, res) {
		console.log("req.body : " + req.body);
		mongo.deleteMany(req.params._diaryOrGoal, req.body, function(result) { res.send(result);});
	});	
};

module.exports = { router: router};
