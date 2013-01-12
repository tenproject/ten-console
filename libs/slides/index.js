var express = require('express');
var app = module.exports = express();

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    database = require('../database'),
    mixin = require('../mixin');

// Views
app.set('views', __dirname);
app.set('view engine', 'jade');

// Routes
app.get('/slides/create', mixin.ensureAuthenticated, function(req, res) {
  res.render('create', { user: req.user });
});

app.post('/slides/create', mixin.ensureAuthenticated, function(req, res) {
  console.log(req.body);

  // Create a new slide
  var obj = {
    title: req.param('title'),
    description: req.param('description'),
    remarks: req.param('remarks'),
    source_url: req.param('source_url'),
    location: req.param('location'),
    author: req.user._id
  };

  database.Slide.create(obj, function (err, small) {
    if (err) return handleError(err);
    res.redirect('/console');
  });
});

app.get('/slides/edit/:slide', mixin.ensureAuthenticated, function(req, res) {
  database.Slide.findById( req.params.slide )
    .exec(function (err, doc) {
      console.log(doc);
      if (err) return handleError(err);
      res.render('edit', { user: req.user, slide: doc});
    });
});

app.delete('/slides/edit/:slide', mixin.ensureAuthenticated, function(req, res) {
  database.Slide.findById(req.params.slide)
    .exec(function (err, doc) {
      if (err) return handleError(err);
      doc.remove(function (err, doc) {
        if (err) return handleError(err);
        res.send(200);
      });
    });
});


app.get('/slides', mixin.ensureAuthenticated, function(req, res) {
  console.log(res.locals.formatDate);
  database.Slide.find()
    .limit(25)
    .sort('field -_id')
    .exec(function (err, slides) {
      res.render('list', { user: req.user, slides: slides});
    });
});