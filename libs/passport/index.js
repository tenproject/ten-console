var express = require('express');
var app = module.exports = express();

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    database = require('../database');

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
  done(null, user);
  // database.User.findOne({ username: username }, function(err, user) {
  //   console.log("logged in!");
  //   done(err, user);
  // });
});