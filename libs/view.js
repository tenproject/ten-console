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
  return string.charAt(0).toUpperCase() + string.slice(1);;
}

module.exports = function () {
  return function (req, res, next) {
    // methods
    res.locals.formatDate = formatDate;
    res.locals.userObject = userObject;
    res.locals.stringify = stringify;
    res.locals.capitalize = capitalize;

    // objects
    res.locals.user = req.user;

    next();
  }
};