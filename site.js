var database = require('./libs/database');

exports.index = function(req, res) {
  res.render('index', { user: req.user });
};

exports.console = function(req, res) {
  // console.log(req.user);
  database.Slide.find({})
    .limit(10)
    .sort('field -_id')
    .exec(function (err, slides) {
      res.render('console', { user: req.user, slides: slides});
    });
};