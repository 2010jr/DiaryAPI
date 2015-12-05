'use strict';
var router;

var mongo = require('./mongo');
var ldap = require('./ldap_client');
var body_parser = require('body-parser');
var express = require('express');

function basicAuthenticate(req, res, next) {
	var auth,
	    login;
	
	console.log('req:' + req);
	if (!req.headers.authorization) {
		return authenticate(res);
	}
	
	console.log('req.headers.authorization:' + req.headers.authorization);
	auth = req.headers.authorization.replace(/^Basic /, '');
	auth = (new Buffer(auth, 'base64')).toString('utf-8');
	login = auth.split(':');

	ldap.authenticate(login[0], login[1], function(err) {
			if (!err) {
					next();
			} else {
					authenticate(res);
			}
	});
}
		
function authenticate(res) {
		var realm = "test";
		res.writeHead(401, {
				'WWW-Authenticate': 'Basic realm="' + realm + '"'
		});
		return res.end('Basic authorization');
}

router = function(app, server) {
	//app.use(basicAuthenticate);
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
	app.get('/test/:_user?', function(req,res) {
		console.log("start using ldap");
		ldap.authenticate("kusahana",'kusahana');
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
		mongo.find('template', { user: req.params._user, templateName : req.params._templateName}, {},
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
		var criteria = {
				user: req.body.user,
				date: req.body.date
		};
		mongo.update('diary', criteria, req.body, { upsert : true} , function(result) { res.send(result);});
	});

	app.post('/template', function(req, res) {
		//重複チェックが必要
		console.log(req.body);
		var criteria = { 
			user: req.body.user,
			templateName: req.body.templateName
		};

		mongo.update('template', criteria, req.body, { upsert : true}, function(result) { res.send(result);});
	});
	
	app.get('/goal/:_user/:_type(year\|month\|week\|day\|other)/:_date', function(req,res) {
		console.log("get goal invoked");
		console.log(req.params);
		mongo.find('goal', { user : req.params._user, type: req.params._type, date: req.params._date }, {}, 
			function(list) {
				res.json(list);
			}
		);
	});

	app.post('/goal', function(req, res) {
		//重複チェックが必要（重複チェックの条件はユーザと日付）
		console.log("goal post invoked");
		var criteria = {
				user: req.body.user,
				date: req.body.date
		};
		mongo.update('goal', criteria, req.body, { upsert : true}, function(result) { res.send(result);});
	});
	
	app.delete('/goal', function(req, res) {
		console.log("goal delete invoked");
		mongo.deleteMany('goal', req.body, function(result) { res.send(result)});
	});	

	app.delete('/template', function(req, res) {
		console.log("template delete invoked");
		mongo.deleteMany('template', req.body,function(result) { res.send(result)});
	});

	app.delete('/diary', function(req, res) {
		console.log("template delete invoked");
		mongo.deleteMany('template', req.body,function(result) { res.send(result)});
	});
}

module.exports = { router: router};
