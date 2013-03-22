var express = require('express');
var app = module.exports = express();

var mongoose = require('mongoose'),
    database = require('../database');

// APIs
var general = require('./general'),
    locations = require('./locations'),
    slides = require('./slides'),
    users = require('./users');

app.set('views', __dirname);
app.set('view engine', 'jade');

// Route
app.get('/api', function(req, res) {
  res.render('api', { user: req.user, routes: app.routes });
});

// General
app.get('/api/ping', general.ping);

// Locations
app.get('/api/locations', locations.list);

// Slides
app.get('/api/slides', slides.list);
app.get('/api/slides/:location_id', slides.list);
// app.post('/api/slides', slides.create);
// app.delete('/api/slides', slides.delete)