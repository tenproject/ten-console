var express = require('express'),
    database = require('../database'),
    mixin = require('../mixin'),
    request = require('request');
    _ = require('lodash');

var slides = require('../api/slides');

var app = module.exports = express();

// Views
app.set('views', __dirname);
app.set('view engine', 'jade');

// Routes
// Create Slide
app.get('/slides/create', mixin.ensureAuthenticated, function(req, res) {
  database.Organization
    .find({_id: { $in: req.user.organization }})
    .exec(function (err, organizations) {
      database.Location
        .find({organization: { $in: req.user.organization }})
        .populate('organization')
        .exec(function (err, locations) {
          console.log(locations);
          res.locals.organizations = organizations;
          res.locals.locations = locations;
          res.render('create');
        });
    });
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
      res.redirect('/slides');
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
  if (req.user.isAdmin) {
    database.Organization
      .find({})
      .exec(function (err, doc) {
        var org_array = [];

        for (var i = 0; i < doc.length; i++) {
          org_array.push(doc[i]._id);
        }
          database.User
            .findOneAndUpdate({ _id: req.user._id }, { organization: org_array })
            .exec(function (err, doc) {
              if (err) return res.send(err);
              console.log(doc);
            });
      });
  }

  database.Slide
    .findById( req.params.slide )
    .populate('location')
    .populate('user')
    .exec(function (err, slide) {
      console.log(slide);
      if (err) return handleError(err);

        database.Organization
          .find({_id: { $in: slide.user.organization }})
          .exec(function (err, organizations) {
            database.Location
              .find({organization: { $in: slide.user.organization }})
              .populate('organization')
              .exec(function (err, locations) {
                res.locals.organizations = organizations;
                res.locals.locations = locations || null;

                slide.location = _.pluck(slide.location, "_id");

                res.locals.slide = slide;
                res.render('edit');
              });
          });
    });
});

app.post('/slides/edit/:slide', mixin.ensureAuthenticated, function(req, res) {
  console.log(req.body);
  if (!req.body.location) {
    req.body.location = [];
  }

  database.Slide
    .findOneAndUpdate({ _id: req.params.slide }, req.body)
    .populate('user')
    .exec(function (err, doc) {
      console.log(doc);
      if (err) {
        console.log(err);
        return res.send(err);
      }

      database.Organization
        .find({_id: { $in: doc.user.organization }})
        .exec(function (err, organizations) {
          database.Location
            .find({organization: { $in: doc.user.organization }})
            .populate('organization')
            .exec(function (err, locations) {
              res.locals.organizations = organizations;
              res.locals.locations = locations;
              res.locals.slide = doc;
              res.redirect('/slides');
            });
        });
    });
});

app.delete('/slides/edit/:slide', mixin.ensureAuthenticated, function(req, res) {
  console.log(req.param('slide'))
  database.Slide.findById(req.param('slide'))
    .exec(function (err, doc) {
      if (err) return res.send(err);
        console.log('omg', doc);
      doc.remove(function (err, doc) {
        if (err) return res.send(err);
        res.send(200);
      });
    });
});

app.get('/slides', mixin.ensureAuthenticated, function(req, res) {
  if (req.param('location')) {
    database.Slide
      .find({ user: req.user._id, location: { $in: [req.param('location')] } })
      .populate('location', 'name')
      .populate('user', 'username')
      .sort('field -_id')
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
      if (err) return res.send(err);
      res.locals.slide = slide;

      // Does use have rights to access slide details?
      if (req.user.isAdmin || (req.user.name == slide.user.name)) {
        res.locals.viewable = true;
      } else {
        res.locals.viewable = false;
      }

      res.render('show');
    });
});
