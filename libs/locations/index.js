var express = require('express'),
    database = require('../database'),
    mixin = require('../mixin');

var app = module.exports = express();

// Views
app.set('views', __dirname);
app.set('view engine', 'jade');

// Routes
app.get('/locations', function (req, res) {
  database.Location.find({})
  .limit(10)
  .sort('field -_id')
  .populate('user', 'username')
  .exec(function (err, docs) {
    res.locals.locations = docs;
    res.render('locations');
  });
});

app.get('/locations/create', function (req, res) {
  res.render('create');
});

app.post('/locations/create', function (req, res) {
  var location = new database.Location(req.body);

  location.user = req.user._id;

  location.save(function (err, d) {
    if (err) {
      console.log(err);
      res.locals.msg = err;
      res.render('create');
    } else {
      res.redirect('/locations');
    }
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
