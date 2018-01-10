const express = require('express');
const cfEnv = require('cfenv');
const { Db } = require('./db/mongo');
const routes = require('./routes/routes');
const log = require('./log/logger').createLogger('app');

const appEnv = cfEnv.getAppEnv();
const port = appEnv && appEnv.port ? appEnv.port : 3000;

const app = express();
const dbPromise = Db.createDbPromise().catch(err => log.error(`Fail to connect to db ${err.message}`));
const db = new Db(dbPromise);

routes.router(app, db);
app.listen(port);

log.info('Listening on port %d in %s mode', port, app.settings.env);
