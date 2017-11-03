const express = require('express');
const cfEnv = require('cfenv');
const db = require('./db/mongo');
const routes = require('./routes/routes');
const log = require('./log/logger');

const appEnv = cfEnv.getAppEnv();
const port = appEnv && appEnv.port ? appEnv.port : 3000;

const app = express();
const { Db } = db;
log.info('Invoke Router');
routes.router(app, new Db());
app.listen(port);

log.info('Listening on port %d in %s mode', port, app.settings.env);
