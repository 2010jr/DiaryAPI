'use strict';
var router;

var mongo = require('./mongo');
var body_parser = require('body-parser');
var express = require('express');

router = function(app, server) {
	app.use(body_parser.urlencoded({ extended: false }));
	app.use(body_parser.json());
	app.use(express.static(__dirname + '/public'));	
	
	app.all('/*', function(req, res, next) {
		res.contentType('json');
		res.header('Access-Control-Allow-Origin', '*');
		next();
	});
	app.get('/', function(req, res) {
		res.redirect('/d3_calendar2.html');
	});
	app.get('/diary/:_user?', function(req, res) {
		var criteria = { user : req.params._user };
		for( var props in req.query) {
			if (req.query.hasOwnProperty(props)) {
				console.log(req.query[props]);
				criteria[props] = req.query[props];
			}
		}
		console.log("criteria : " + criteria);
		mongo.find('diary', criteria, {}, function(list) { res.json(list);});
	});	
	app.get('/diary/:_user/:_date', function(req, res) {
		mongo.find('diary', { user: req.params._user, date: req.params._date }, {}, 
			function(list) {
				res.json(list);
			}
		);
	});
	app.get('/template/:_user/:_templateName', function(req, res) {
		mongo.find('template', { user: req.params._user, templateName: req.params._templateName}, {},
			function(list) {
				res.json(list);
			}
		);
	});
	app.get('/template/:_user?', function(req, res) {
		var criteria = { user : req.params._user };
		for( var props in req.query) {
			if (req.query.hasOwnProperty(props)) {
				console.log(req.query[props]);
				criteria[props] = req.query[props];
			}
		}
		console.log("criteria : " + criteria);
		mongo.find('template', criteria, {}, function(list) { res.json(list);});
	});	

	app.post('/diary', function(req, res) {
		//重複チェックが必要
		console.log(req.body);
		mongo.insert('diary', req.body , {}, 
			function(result) {
				res.send(result);
			}
		);
	});

	app.post('/template', function(req, res) {
		//重複チェックが必要
		console.log(req.body);
		mongo.insert('template', req.body , {}, 
			function(result) {
				res.send(result);
			}
		);
	});
	
	app.get('/goal/:_user/:_type(year\|month\|week)/:_date', function(req,res) {
		console.log(req.params);
		mongo.find('goals', { user : req.params._user, type: req.params._type, date: req.params._date }, {}, 
			function(list) {
				res.json(list);
			}
		);
	});

	app.post('/goal', function(req, res) {
		//重複チェックが必要
		console.log("goal post invoked");
		console.log(req.body);
		mongo.insert('goals', req.body , {}, 
			function(result) {
				res.send(result);
			}
		);
	});
}

module.exports = { router: router};
