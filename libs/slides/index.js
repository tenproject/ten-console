var express = require('express'),
    database = require('../database'),
    mixin = require('../mixin'),
    request = require('request');

var slides = require('../api/slides');

var app = module.exports = express();

// Views
app.set('views', __dirname);
app.set('view engine', 'jade');

// Routes
// Create Slide
app.get('/slides/create', mixin.ensureAuthenticated, function(req, res) {
  res.render('create', { user: req.user });
});

// Create Slide
app.post('/slides/create', mixin.ensureAuthenticated, function(req, res) {
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

app.post('/slides/edit/:slide', mixin.ensureAuthenticated, function(req, res) {
  database.Slide.findOneAndUpdate({ _id: req.params.slide }, req.body, function (err, doc) {
    console.log(doc);
    if (err) {
      console.log(err);
      res.render('edit', { slide: doc });
    } else {
      res.render('edit', { slide: doc });
    }
  });
});

app.delete('/slides/edit/:slide', mixin.ensureAuthenticated, function(req, res) {
  var options = {};

  options.method = "delete";
  options.url = 'http://localhost:' + app.get('port') + '/api/slides';

  request(options, function(e, r, b) {
    res.send(b);
  });
});

app.get('/slides', mixin.ensureAuthenticated, function(req, res) {
  // var options = {};

  // options.url = 'http://localhost:' + app.get('port') + '/api/slides';
  // options.json = true;

  // request.get(options, function(e, r, b) {
  //   res.locals.slides = b;
  //   res.render('list');
  // });

  if (req.param('location')) {
    database.Slide
      .find({ user: req.user._id, location: { $in: [req.param('location')] } })
      .populate('location', 'name')
      .populate('user', 'username') // populates username & _id only
      .sort('field -_id') // sort by ID chronological
      .exec(function (err, my_slides) {
        if (err) {
          return res.send(err);
        }
        if (req.user.isAdmin) {
          // Everyone elses
          database.Slide
            .find({ user: {$nin: [req.user._id] }, location: { $in: [req.param('location')] } })
            .populate('location')
            .populate('user', 'username') // populates username & _id only
            .sort('field -_id') // sort by ID chronological
            .exec(function (err, slides) {
              if (err) {
                return res.send(err);
              }
              res.locals.my_slides = my_slides;
              res.locals.slides = slides;
              res.render('list');
            });
        } else {
          res.locals.my_slides = my_slides;
          res.locals.slides = null;
          res.render('list');
        }
      });
    return;
  }

  // Your slides
  database.Slide
    .find({ user: req.user._id })
    .populate('location', 'name')
    .populate('user', 'username') // populates username & _id only
    .sort('field -_id') // sort by ID chronological
    .exec(function (err, my_slides) {
      if (err) {
        return res.send(err);
      }
      if (req.user.isAdmin) {
        // Everyone elses
        database.Slide
          .find({ user: {$nin: [req.user._id] } })
          .populate('location')
          .populate('user', 'username') // populates username & _id only
          .sort('field -_id') // sort by ID chronological
          .exec(function (err, slides) {
            if (err) {
              return res.send(err);
            }
            res.locals.my_slides = my_slides;
            res.locals.slides = slides;
            res.render('list');
          });
      } else {
        res.locals.my_slides = my_slides;
        res.locals.slides = null;
        res.render('list');
      }
    });
});


app.get('/slides/:slide', mixin.ensureAuthenticated, function(req, res) {
  database.Slide
    .findOne({ _id: req.param('slide')})
    .populate('location', 'name')
    .populate('user', 'username')
    .exec(function (err, slide) {
      if (err) {
        console.log(err)
        res.send(err);
        return;
      }
      res.locals.slide = slide;
      res.render('show');
    });
});
