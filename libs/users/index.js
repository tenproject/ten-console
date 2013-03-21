var express = require('express'),
    database = require('../database'),
    mixin = require('../mixin');

var app = module.exports = express();

// Views
app.set('views', __dirname);
app.set('view engine', 'jade');

// Routes
app.get('/users/me', mixin.ensureAuthenticated, function (req, res) {
  database.User.findById(req.user._id, function (err, doc) {
    if (err) {
      // res.render('500');
    } else {
      res.locals.user = doc;
      res.render('profile');
    }
  });
});

app.get('/users/me/edit', mixin.ensureAuthenticated, function (req, res) {
  database.User.findById(req.user._id, function (err, doc) {
    if (err) {
      // res.render('500');
    } else {
      res.locals.user = doc;
      res.render('profile_edit');
    }
  });
});

app.post('/users/me/edit', mixin.ensureAuthenticated, function (req, res) {
  var update = req.body;

  // Prevent saving empty password
  if (req.body.password == '') {
    delete req.body.password
  };

  database.User.findOneAndUpdate(req.user._id, update, function (err, doc) {
    if (err) {
      // res.render('500');
    } else {
      res.locals.user = doc;
      res.locals.msg = "Profile Updated!"
      res.render('profile_edit');
    }
  });
});

app.get('/users/:id', mixin.ensureAuthenticated, function (req, res) {
  database.User.findById(req.params.id, function (err, doc) {
    if (err) {
      // res.render('500');
    } else {
      res.locals.profile = doc;
      res.render('profile_public');
    }
  });
});
