const bodyParser = require('body-parser');
const express = require('express');
const account = require('../config/account.json');
const path = require('path');
const log = require('../log/logger').createLogger('route');

function authenticate(res) {
  const realm = 'Diary App';
  res.writeHead(401, {
    'WWW-Authenticate': `Basic realm=${realm}`,
  });
  return res.end('Basic authorization');
}

function extractUserName(req) {
  if (!req.headers.authorization) {
    return null;
  }
  const auth = req.headers.authorization.replace(/^Basic /, '');
  const loginInfo = (new Buffer(auth, 'base64')).toString('utf-8').split(':');
  return loginInfo[0];
}

function basicAuthenticate(req, res, next) {
  if (!req.headers.authorization) {
    return authenticate(res);
  }
  const auth = req.headers.authorization.replace(/^Basic /, '');
  const auth1 = (new Buffer(auth, 'base64')).toString('utf-8');
  const login = auth1.split(':');

  if (account[login[0]] && account[login[0]] === login[1]) {
    next();
  } else {
    authenticate(res);
  }
}

const router = (app, db) => {
  app.use(basicAuthenticate);
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(express.static(path.resolve(__dirname, '../public')));
  app.use((err, req, res, next) => {
    log.error(err.stack);
    res.status(500).send('Something broke');
  });
  app.all('/*', (req, res, next) => {
    res.contentType('json');
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
  app.get('/', (req, res) => {
    log.info('Request to route is comming, so redirect to index.html');
    res.redirect('/index.html');
  });

  app.get('/:diaryOrGoal(diary|goal)?', (req, res) => {
    let criteria = { user: extractUserName(req) };
    criteria = Object.assign(criteria, req.query);
    log.info('criteria');
    log.info(criteria);
    db.find(req.params.diaryOrGoal, criteria).then((list) => { res.json(list); });
  });

  app.get('/:diaryOrGoal(diary|goal)/:goalType(year|quarter|month|week|day)/:date', (req, res) => {
    const criteria = {
      user: extractUserName(req),
      type: req.params.goalType,
      date: req.params.date,
    };

    db.find(req.params.diaryOrGoal, criteria).then((list) => {
      res.json(list);
    });
  });

  app.get('/:diaryOrGoal(diary|goal)/:goalType(year|quarter|month|week|day)?', (req, res) => {
    let criteria = { user: extractUserName(req), type: req.params.goalType };
    criteria = Object.assign(criteria, req.query);
    db.find(req.params.diaryOrGoal, criteria).then((list) => { res.json(list); });
  });


  app.post('/diary', (req, res) => {
    const criteria = {
      user: extractUserName(req),
      date: req.body.date,
    };
    const data = req.body;
    data.user = extractUserName(req);

    db.update('diary', criteria, req.body, { upsert: true }).then((result) => { res.send(result); });
  });


  app.post('/goal', (req, res) => {
    if (Array.isArray(req.body)) {
      const user = extractUserName(req);
      const ids = req.body.map(content => content._id);
      const dataSet = req.body.map((content) => {
        const data = Object.assign({}, content);
        data.user = user;
        return data;
      });

      db.deleteMany('goal', { _id: { $in: ids } }).then((result) => {
        log.info(`Deleted ${result.length} goal`);
      }).then(() => {
        return db.insert('goal', dataSet);
      }).then((result) => {
        req.send(result);
      });
    } else {
      const criteria = {
        user: extractUserName(req),
        date: req.body.date,
      };
      const data = req.body;
      data.user = extractUserName(req);
      db.update('goal', criteria, data, { upsert: true }).then((result) => { res.send(result); });
    }
  });

  app.delete('/:diaryOrGoal(diary|goal)', (req, res) => {
    db.deleteMany(req.params.diaryOrGoal, req.body).then((result) => { res.send(result); });
  });
};

module.exports = { router };
