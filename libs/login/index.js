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
  database.User.findById(user._id)
    .select('-password')
    .exec(function(err, user) {
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
  database.Organization
    .find({})
    .exec(function (err, doc) {
      if (err) {
        return res.send("Unable to retrieve organizations", err);
      }
      res.locals.organizations = doc;
      res.render('register');
    });
});

app.post('/register', function(req, res) {
  console.log(req.body);

  var user = new database.User();

  user.username = req.param('username');
  user.email = req.param('email');
  user.firstname = req.param('firstname');
  user.lastname = req.param('lastname');
  user.password = req.param('password');
  user.organization = [req.param('organization')];

  user.save(function(err, doc) {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    console.log(doc);
    res.redirect('/');
  });
});