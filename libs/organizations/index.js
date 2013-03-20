var express = require('express'),
    database = require('../database'),
    mixin = require('../mixin');

var app = module.exports = express();

// Views
app.set('views', __dirname);
app.set('view engine', 'jade');

// Routes
app.get('/organizations', function (req, res) {
  database.Organization
    .find({})
    .populate('created_by', 'username')
    .exec(function (err, doc) {
      res.locals.organizations = doc;
      res.render('organizations');
    });
});

app.get('/organizations/create', function (req, res) {
  res.render('create');
});

app.post('/organizations/create', function (req, res) {
  var organization = new database.Organization(req.body);

  console.log(req.body) ;
  console.log(req.params);

  organization.created_by = req.user._id;

  organization.save(function (err, doc) {
    if (err) {
      console.log(err);
      res.locals.msg = err;
      res.render('create');
    } else {
      res.redirect('/organizations');
    }
  });
});

app.get('/organizations/:organization', function (req, res) {
  database.Organization
    .find({ id: req.param('organization')})
    .populate('created_by', 'username')
    .exec(function (err, doc) {
      res.locals.organizations = doc;
      res.render('organizations');
    });
});
