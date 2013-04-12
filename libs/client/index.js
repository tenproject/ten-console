var express = require('express'),
    database = require('../database'),
    mixin = require('../mixin');

var app = module.exports = express();

// Views
app.set('views', __dirname);
app.set('view engine', 'jade');

// Routes
app.get('/client', function (req, res) {
  database.Location
    .find({})
    .exec(function (err, doc) {
      if (err) return res.json(err);
      res.locals.locations = doc;
      res.render('list');
    });
});

app.get('/client/:location', function (req, res) {
  res.locals.location = req.param('location');
  res.render('client');
});