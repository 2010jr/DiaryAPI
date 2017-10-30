'use strict'

var http = require('http');
var express = require('express');
var cfEnv = require('cfenv');

var routes = require('./routes/routes');
var app = express();
var appEnv = cfEnv.getAppEnv();
var server = http.createServer(app);
var port = appEnv && appEnv.port ? appEnv.port : 3000;

routes.router(app, server);
server.listen(port);

console.log('Listening on port %d in %s mode', port, app.settings.env);
