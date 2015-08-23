'use strict';
var router;

var mongo = require('./mongo');
var body_parser = require('body-parser');
var express = require('express');

router = function(app, server) {
	app.use(body_parser.urlencoded({ extended: false }));
	app.use(express.static(__dirname + '/public'));	
	
	app.all('/*', function(req, res, next) {
		res.contentType('json');
		res.header('Access-Control-Allow-Origin', '*');
		next();
	});
	app.get('/', function(req, res) {
		res.redirect('/d3_calendar2.html');
	});
	app.get('/diary/:_user/:_date', function(req, res) {
		mongo.find('diary', { user: req.params._user, date: req.params._date }, {}, 
			function(list) {
				res.json(list);
			}
		);
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
	
	app.get('/goals/:_user/:_type(year\|month\|week)/:_date', function(req,res) {
		mongo.find('goals', { name: req.params._user, type: req.params._type, date: req.params._date }, {}, 
			function(list) {
				res.json(list);
			}
		);
	});

	app.post('/goals', function(req, res) {
		//重複チェックが必要
		mongo.insert('goals', req.body , {}, 
			function(result) {
				res.send(result);
			}
		);
	});
}

module.exports = { router: router};
