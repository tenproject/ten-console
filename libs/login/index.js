var express = require('express');
var app = module.exports = express();

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

app.set('views', __dirname);
app.set('view engine', 'jade');

// Login
app.get('/login', function(req, res) {
  res.render('login', { user: req.user });
});

app.post('/login', passport.authenticate('local', { successRedirect: '/console', failureRedirect: '/login' }));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


// Register
app.get('/register', function(req, res) {
  res.render('register', { user: req.user });
});

app.post('/register', function(req, res) {
  // Register a new user
  var user = new database.User({ username: req.param('username'), password: req.param('password') });
  user.save(function(err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});