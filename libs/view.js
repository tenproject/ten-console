function formatDate (date) {
  var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  return monthNames[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear();
}

module.exports = function () {
  return function (req, res, next) {
    res.locals.formatDate = formatDate;
    next();
  }
};