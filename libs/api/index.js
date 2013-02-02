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
app.get('/api', api = function(req, res) {
  res.render('api', { user: req.user, routes: app.routes });
});

// REST API
// General
app.get('/api/ping', general.ping);


// Locations

// Slides
app.post('/api/slides', slides.create);
app.get('/api/slides/:id', slides.retrieve);
app.get('/api/slides', slides.list);
app.delete('/api/slides', slides.delete)