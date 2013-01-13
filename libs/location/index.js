var express = require('express'),
    database = require('../database'),
    mixin = require('../mixin');

var app = module.exports = express();

// Views
app.set('views', __dirname);
app.set('view engine', 'jade');

// Routes