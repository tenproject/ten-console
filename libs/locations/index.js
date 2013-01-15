var express = require('express'),
    database = require('../database'),
    mixin = require('../mixin');

var app = module.exports = express();

// Views
app.set('views', __dirname);
app.set('view engine', 'jade');

// Routes
app.get('/locations', function (req, res) {
  database.Slide.find({ location: {} })
  .limit(10)
  .exec(function (err, docs) {
    res.locals.slides = docs;
    res.render('locations');
  });
});

app.get('/locations/:location', function (req, res) {
  database.Slide.find({ location: { $in: [ req.params.location ] } })
  .limit(10)
  .exec(function (err, docs) {
    res.locals.slides = docs;

    res.render('locations');
  });
});
