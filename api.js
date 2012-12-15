var _package = require('./package.json'),
    mongoose = require('mongoose'),
    database = require('./database');

exports.ping = function(req, res) {
  res.json({version: _package.version, name: _package.name});
};

exports.slides = {
  listAll: function(req, res) {
    var obj = {
      id: "12",
      location: "Trottier",
      slides: [1, 2, 3]
    };

    res.json(obj);
  },

  findById: function(req, res) {
    var id = req.params.id;

    database.Cat.findOne({ name: "testing2" }, function (err, obj) {
      if (err) return handleError(err);
      res.json(obj);
    });

  }
};