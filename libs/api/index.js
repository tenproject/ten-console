var express = require('express');
var app = module.exports = express();

var mongoose = require('mongoose'),
    _package = require('../../package.json'),
    database = require('../database');

app.set('views', __dirname);
app.set('view engine', 'jade');

// Route
app.get('/api', api = function(req, res) {
  res.render('api', { user: req.user });
});

// Api
app.get('/api/ping', function(req, res) {
  res.json({version: _package.version, name: _package.name});
});

app.get('/api/slides', function(req, res) {
  database.Slide.find({}, function (err, obj) {
    if (err) return handleError(err);
    res.json(obj);
  });
});

app.get('/api/slides/:id', function(req, res) {
  var id = req.params.id;

  database.Slide.findOne({ name: id }, function (err, obj) {
    if (err) return handleError(err);
    res.json(obj);
  });
});

app.post('/api/slides', function(req, res) {
  console.log(req.params);

  var slide = new database.Slide({ name: req.params.name || "hello" });
  slide.save(function (err, obj) {
    if (err) {}
    res.json(obj);
  });
});