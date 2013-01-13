var mongoose = require('mongoose'),
    _package = require('../../package.json'),
    database = require('../database');

exports.ping = function(req, res) {
  res.json({version: _package.version, name: _package.name});
};

exports.slides = {};

exports.slides.listAll = function(req, res) {
  database.Slide.find({}, function (err, obj) {
    if (err) return handleError(err);
    res.json(obj);
  });
};

exports.slides.findById = function(req, res) {
  var id = req.params.id;

  database.Slide.findOne({ name: id }, function (err, obj) {
    if (err) return handleError(err);
    res.json(obj);
  });

};

exports.slides.create =  function(req, res) {
  console.log(req.params);

  var slide = new database.Slide({ name: req.params.name || "hello" });
  slide.save(function (err, obj) {
    if (err) {}
    res.json(obj);
  });
};