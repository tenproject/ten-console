exports.index = function(req, res) {
  res.render('index');
};

exports.api = function(req, res) {
  res.render('api');
};

exports.templates = function(req, res) {
  var name = req.params.name;
  res.render('templates/' + name);
};