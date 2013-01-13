var express = require('express'),
    database = require('../database'),
    mixin = require('../mixin');

var app = module.exports = express();

// Views
app.set('views', __dirname);
app.set('view engine', 'jade');

// Routes
app.get('/slides/create', mixin.ensureAuthenticated, function(req, res) {
  res.render('create', { user: req.user });
});

app.post('/slides/create', mixin.ensureAuthenticated, function(req, res) {
  var slide = new database.Slide(req.body);

  slide.user = req.user._id;

  slide.save(function(err, d) {
    if (err) {
      //
    } else {
      res.redirect('/console');
    }
  });

  // Create a new slide
  // var obj = {
  //   title: req.param('title'),
  //   description: req.param('description'),
  //   remarks: req.param('remarks'),
  //   source_url: req.param('source_url'),
  //   location: req.param('location'),
  //   user: req.user
  // };

  // database.Slide.create(obj, function (err, small) {
  //   if (err) return handleError(err);
  //   res.redirect('/console');
  // });
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
  database.Slide.find({})
    .limit(25)
    .populate('user', 'username') // populates username & _id only
    .sort('field -_id') // sort by ID chronological
    .exec(function (err, slides) {
      res.locals.user = req.user;
      res.locals.slides = slides;
      res.render('list');
    });
});