var mongoose = require('mongoose'),
    database = require('../database');


exports.list = function (req, res) {
  database.Location
    .find({})
    .populate('organization', 'name')
    .select('-__v -user -time_created -remarks')
    .exec(function(err, doc) {
      if (err) return res.send(err);
      res.json(doc);
    });
};