var _package = require('../../package.json');

exports.ping = function (req, res) {
  res.json({
    "version": _package.version,
    "name": _package.name
  });
};