var express = require('express'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    database = require('../database'),
    request = require('request');

var app = module.exports = express();

app.set('views', __dirname);
app.set('view engine', 'jade');

// Passport Configuraton
passport.use(new LocalStrategy(
  function(username, password, done) {
    // database.User.findOne({ username: username }, function (err, user) {
    //   console.log(user);
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
    //   return done(null, user);
    // });

    var options = {
      method: 'GET',
      uri: app.get('api server') + "users/" + username,
      headers: {
        authorization: 'Basic dGVuOjEyMw=='
      }
    }

    request(options, function (err, res, body) {
      if (err) { return done(err); }
      console.log(res.statusCode);
      if (res.statusCode == 404) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      done(err, body);
    });
    }
));

passport.serializeUser(function(user, done) {
  done(null, JSON.parse(user)); // serialize whole user object.
});

passport.deserializeUser(function(user, done) {
  // database.User.findById(user._id, function(err, user) {
  //   done(err, user);
  // });

  var options = {
    method: 'GET',
    uri: app.get('api server') + "users/" + user.username,
    headers: {
      authorization: 'Basic dGVuOjEyMw=='
    }
  }

  request(options, function (err, res, body) {
    done(err, JSON.parse(body));
  });
});

// Routes - Login
app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', { successRedirect: '/console', failureRedirect: '/login' }));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


// Routes - Register
app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res) {
  // var user = new database.User({ username: req.param('username'), email: req.param('email'), firstname: req.param('firstname'), lastname: req.param('lastname'), password: req.param('password') });
  // user.save(function(err) {
  //   if (err) {
  //     console.log(err);
  //   }
  //   res.redirect('/');
  // });
});