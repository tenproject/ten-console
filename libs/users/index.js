var express = require('express'),
    database = require('../database'),
    mixin = require('../mixin');

var app = module.exports = express();

// Views
app.set('views', __dirname);
app.set('view engine', 'jade');

// Routes
app.get('/users/me', function (req, res) {
  database.User.findById(req.user._id, function (err, doc) {
    if (err) {
      // res.render('500');
    } else {
      res.locals.user = doc;
      res.render('profile');
    }
  });
});

app.get('/users/me/edit', function (req, res) {
  database.User.findById(req.user._id, function (err, doc) {
    if (err) {
      // res.render('500');
    } else {
      res.locals.user = doc;
      res.render('profile_edit');
    }
  });
});

app.post('/users/me/edit', function (req, res) {
  database.User.findOneAndUpdate(req.user._id, req.body, function (err, doc) {
    if (err) {
      // res.render('500');
    } else {
      res.locals.user = doc;
      res.render('profile_edit');
    }
  });
});

app.get('/users/:id', function (req, res) {
  database.User.findById(req.params.id, function (err, doc) {
    if (err) {
      // res.render('500');
    } else {
      res.locals.user = doc;
      res.render('profile');
    }
  });
});
