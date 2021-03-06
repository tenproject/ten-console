var express = require('express'),
    database = require('../database'),
    mixin = require('../mixin');

var app = module.exports = express();

// Views
app.set('views', __dirname);
app.set('view engine', 'jade');

// Routes
app.get('/locations', mixin.ensureAuthenticated, function (req, res) {
  if (req.param('organization')) {
    database.Location.find({ organization: req.param('organization') })
      .populate('user', 'username')
      .populate('organization')
      .exec(function (err, docs) {
        if (err) {
          return res.json({ error: err, payload: "Probably not found" });
        }

        res.locals.organization = req.param('organization');
        res.locals.locations = docs;
        res.render('locations');
      });
  } else {
    database.Location.find({})
      .sort('field -_id')
      .populate('user', 'username')
      .populate('organization', 'name')
      .exec(function (err, docs) {
        res.locals.locations = docs;
        res.render('locations');
      });
  }
});

app.get('/locations/create', mixin.ensureAuthenticated, function (req, res) {
  database.Organization
    .find({ _id: { $in: req.user.organization }})
    .select('-__v -created_by -time_created')
    .exec(function (err, doc) {
      console.log(doc);
      res.locals.organizations = doc;
      res.render('create');
    });
});

app.post('/locations/create', mixin.ensureAuthenticated, function (req, res) {
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

app.get('/locations/:location', mixin.ensureAuthenticated, function (req, res) {
  database.Slide.find({ location: { $in: [ req.param('location') ] } })
  .exec(function (err, docs) {
    res.locals.slides = docs;

    res.render('locations');
  });
});


app.get('/locations/edit/:location', mixin.ensureAuthenticated, function (req, res) {
  database.Location
    .findById(req.param('location'))
    .exec(function (err, docs) {
      if (err) {
        return res.send(err);
      }

      res.locals.location = docs;
      res.render('edit');
    });
});

app.post('/locations/edit/:location', mixin.ensureAuthenticated, function (req, res) {
  database.Location.findOneAndUpdate({ _id: req.param('location') }, req.body, function (err, doc) {
    if (err) {
      console.log(err);
      return res.send(err);
    }

    res.locals.location = doc;
    res.render('edit');
  });
});

app.delete('/locations/edit/:location', mixin.ensureAuthenticated, function (req, res) {
  database.Location
    .findById(req.param('location'))
    .exec(function (err, doc) {
      if (err) return handleError(err);
      doc.remove(function (err, doc) {
        if (err) return handleError(err);
        res.send(200);
      });
    });
});