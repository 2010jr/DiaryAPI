const bodyParser = require('body-parser');
const express = require('express');
const account = require('../config/account.json');
const path = require('path');
const log = require('../log/logger');

function authenticate(res) {
  const realm = 'Diary App';
  res.writeHead(401, {
    'WWW-Authenticate': 'Basic realm="' + realm + '"',
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

const router = function (app, db) {
  app.use(basicAuthenticate);
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(express.static(path.resolve(__dirname, '../public')));
  app.use(function (err, req, res, next) {
    log.error(error(err.stack));
    res.status(500).send('Something broke');
  });
  app.all('/*', function (req, res, next) {
    res.contentType('json');
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
  app.get('/', function (req, res) {
    console.log("Root index" + req)
    res.redirect('/index.html');
  });
  app.get('/:_diaryOrGoal(diary\|goal)?', function (req, res) {
    var criteria = { user: extractUserName(req) };
    for (var props in req.query) {
      if (req.query.hasOwnProperty(props)) {
        console.log(req.query[props]);
        criteria[props] = req.query[props];
      }
    }
    console.log("criteria : " + criteria);
    db.find(req.params._diaryOrGoal, criteria, {}, function (list) { res.json(list); });
  });

  app.get('/:_diaryOrGoal(diary\|goal)/:_goalType(year\|quarter\|month\|week\|day)/:_date', function (req, res) {
    db.find(req.params._diaryOrGoal, { user: extractUserName(req), type: req.params._goalType, date: req.params._date }, {},
      function (list) {
        res.json(list);
      }
    );
  });

  app.get('/:_diaryOrGoal(diary\|goal)/:_goalType(year\|quarter\|month\|week\|day)?', function (req, res) {
    console.log("get goal invoked");
    var criteria = { user: extractUserName(req), type: req.params._goalType };
    for (var props in req.query) {
      if (req.query.hasOwnProperty(props)) {
        console.log(req.query[props]);
        criteria[props] = req.query[props];
      }
    }
    db.find(req.params._diaryOrGoal, criteria, {},
      function (list) {
        res.json(list);
      }
    );
  });


  app.post('/diary', function (req, res) {
    var criteria = {
      user: extractUserName(req),
      date: req.body.date
    };
    var data = req.body;
    data.user = extractUserName(req);

    db.update('diary', criteria, req.body, { upsert: true }, function (result) { res.send(result); });
  });


  app.post('/goal', function (req, res) {
    if (Array.isArray(req.body)) {
      var user = extractUserName(req);
      var ids = req.body.map(function (val) { return val._id; });
      var dataSet = req.body.map(function (val) { val.user = user; return val });

      db.deleteMany('goal', { _id: { $in: ids } }, function (result) {
        db.insert('goal', dataSet, {}, function (result) {
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
      db.update('goal', criteria, data, { upsert: true }, function (result) { res.send(result); });
    }
  });

  app.delete('/:_diaryOrGoal(diary\|goal)', function (req, res) {
    db.deleteMany(req.params._diaryOrGoal, req.body, function (result) { res.send(result); });
  });
};

module.exports = { router: router };
