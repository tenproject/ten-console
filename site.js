exports.index = function(req, res) {
  res.render('index', { user: req.user });
};

exports.api = function(req, res) {
  res.render('api', { user: req.user });
};

exports.console = function(req, res) {
  console.log(req.user);
  res.render('console', { user: req.user });
};