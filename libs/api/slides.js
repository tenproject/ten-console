var mongoose = require('mongoose'),
    database = require('../database');

exports.list = function (req, res) {
  if (req.param('location_id')) {
    // Display all online slides for specified location
    database.Slide
      .find({ status: 'online', location: { $in: [req.param('location_id')] } })
      .populate('location', 'name')
      .populate('user', 'username') // populates username & _id only
      .select('-location -__v -remarks -time_created -organization -status')
      .sort('field -_id') // sort by ID chronological
      .exec(function (err, doc) {
        if (err) {
          return res.send(err);
        }
        res.json(doc);
      });
  } else {
    // Display all online slides for all locations
    database.Slide
      .find({ status: 'online' })
      .populate('user', 'username') // populates username & _id only
      .populate('location', 'name')
      .sort('field -_id') // sort by ID chronological
      .select('-__v -remarks -time_created -organization -status')
      .exec(function (err, slides) {
        res.json(slides);
      });
  }
};

// exports.retrieve = function(req, res) {
//   var id = req.params.id;

//   database.Slide.findOne({ name: id }, function (err, obj) {
//     if (err) return handleError(err);
//     res.json(obj);
//   });
// };

// exports.create = function(req, res) {
//   var slide = new database.Slide(req.body);

//   slide.user = req.user._id;

//   slide.save(function (err, d) {
//     if (err) {
//       console.log(err);
//       res.locals.msg = err;
//       res.render('create');
//     } else {
//       res.redirect('/console');
//     }
//   });
// };

// exports.delete = function(req, res) {
//   database.Slide.findById(req.params.slide)
//     .exec(function (err, doc) {
//       if (err) return handleError(err);
//       doc.remove(function (err, doc) {
//         if (err) return handleError(err);
//         res.send(200);
//       });
//     });
// };