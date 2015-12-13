'use strict'
var http = require('http');
var express = require('express');

var routes = require('./routes');
var app = express();
var server = http.createServer(app);
routes.router(app, server);
server.listen(3000);

console.log('Listening on port %d in %s mode', server.address().port, app.settings.env);
