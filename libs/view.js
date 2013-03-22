var _ = require('lodash');

function formatDate (date) {
  if (typeof(date) == "string") {
    date = new Date(date);
  }

  var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  return monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

function userObject (user) {
  console.log(user);
  return user;
}

function stringify (obj) {
  var json;

  try {
    json = JSON.stringify(obj, null, 2);
  } catch (e) {
    //
  }
  return json;
}

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function tagStatus (string) {
  switch (string) {
    case "submitted":
      return '<span class="label">Submitted</span>';
    case "rejected":
      return '<span class="label">Rejected</span>';
    case "online":
      return '<span class="label success">Online</span>';
    case "offline":
      return '<span class="label alert">Offline</span>';
    case "expired":
      return '<span class="label secondary">Expired</span>';
    case "draft":
      return '<span class="label secondary">Draft</span>';
    default:
      return null;
  }
}

module.exports = function () {
  return function (req, res, next) {
    // methods
    res.locals.formatDate = formatDate;
    res.locals.userObject = userObject;
    res.locals.stringify = stringify;
    res.locals.capitalize = capitalize;
    res.locals.tagStatus = tagStatus;
    res.locals._ = _;

    // objects
    res.locals.user = req.user;

    next();
  }
};