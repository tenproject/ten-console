var express = require('express'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    database = require('../database');

var app = module.exports = express();

app.set('views', __dirname);
app.set('view engine', 'jade');

// Passport Configuraton
passport.use(new LocalStrategy(
  function(username, password, done) {
    database.User.findOne({ username: username }, function (err, user) {
      console.log(user);
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user); // serialize whole user object.
});

passport.deserializeUser(function(user, done) {
  database.User.findById(user._id, function(err, user) {
    done(err, user);
  });
});

// Routes - Login
app.get('/login', function(req, res) {
  res.render('login', { user: req.user });
});

app.post('/login', passport.authenticate('local', { successRedirect: '/console', failureRedirect: '/login' }));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


// Routes - Register
app.get('/register', function(req, res) {
  res.render('register', { user: req.user });
});

app.post('/register', function(req, res) {
  var user = new database.User({ username: req.param('username'), email: req.param('email'), firstname: req.param('firstname'), lastname: req.param('lastname'), password: req.param('password') });
  user.save(function(err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});