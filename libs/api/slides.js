var mongoose = require('mongoose'),
    database = require('../database');

exports.list = function (req, res) {
  database.Slide.find({})
  .limit(25)
  .populate('user', 'username') // populates username & _id only
  .sort('field -_id') // sort by ID chronological
  .exec(function (err, slides) {
    res.send(200, slides);
  });
};

exports.retrieve = function(req, res) {
  var id = req.params.id;

  database.Slide.findOne({ name: id }, function (err, obj) {
    if (err) return handleError(err);
    res.json(obj);
  });
};

exports.create = function(req, res) {
  var slide = new database.Slide(req.body);

  slide.user = req.user._id;

  slide.save(function (err, d) {
    if (err) {
      console.log(err);
      res.locals.msg = err;
      res.render('create');
    } else {
      res.redirect('/console');
    }
  });
};

exports.delete = function(req, res) {
  database.Slide.findById(req.params.slide)
    .exec(function (err, doc) {
      if (err) return handleError(err);
      doc.remove(function (err, doc) {
        if (err) return handleError(err);
        res.send(200);
      });
    });
};