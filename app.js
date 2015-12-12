'use strict'
var http = require('http');
var express = require('express');
var cfenv = require('cfenv');
var routes = require('./routes');

var app = express();
var appEnv = cfenv.getAppEnv();
var server = http.createServer(app);
routes.router(app, server);

server.listen(appEnv.port);

