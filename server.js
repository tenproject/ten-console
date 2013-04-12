var express = require('express'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  RedisStore = require('connect-redis')(express);

var app = express(),
  mixin = require('./libs/mixin');

// Express Configuration
app.set('port', process.argv[2] || 3000);
app.set('view engine', 'jade');
app.locals.pretty = true;

// Express Middleware Stack

// logger
app.use(express.logger('dev'));

// compress response data with gzip/deflate
app.use(express.compress());

// serve static files
app.use(express.static(__dirname + '/public', {
  maxAge: 3600000
}));
app.use(express.favicon());

// error handler
app.use(express.errorHandler({
  dumpExceptions: true,
  showStack: true
}));

// catch unhandled exceptions
process.on('uncaughtException', function(err) {
  console.error(err.stack);
});

// parse request body
app.use(express.bodyParser());

// support _method (e.g. PUT in forms)
app.use(express.methodOverride());

// session support
app.use(express.cookieParser());
app.use(express.session({
  secret: 'ten console secret password',
  // cookie: { httpOnly: true, secure: false },
  store: new RedisStore({
    host: 'lab.redistogo.com',
    port: 9405,
    username: 'redistogo',
    pass: '1561497803dcb7bc34e3e3931267b091'
  })
}));

// passport for auth
app.use(passport.initialize());
app.use(passport.session());

// csrf and middleware for passing token to template
app.use(express.csrf());
app.use(function(req, res, next) {
  res.locals.csrftoken = req.session._csrf;
  next();
});

// expose the "messages" local variable when views are rendered
// app.use(function(req, res, next){
//   var msgs = req.session.messages || [];

//   // expose "messages" local variable
//   res.locals.messages = msgs;

//   // expose "hasMessages"
//   res.locals.hasMessages = !! msgs.length;

//   /* This is equivalent:
//    res.locals({
//      messages: msgs,
//      hasMessages: !! msgs.length
//    });
//   */

//   // empty or "flush" the messages so they
//   // don't build up
//   req.session.messages = [];
//   next();
// });

// expose template view handlers
app.use(require('./libs/view')());

// initialize ten app modules
app.use(require('./libs/login'));
app.use(require('./libs/api'));
app.use(require('./libs/users'));
app.use(require('./libs/slides'));
app.use(require('./libs/organizations'));
app.use(require('./libs/locations'));
app.use(require('./libs/client'));

// route middleware
app.use(app.router);

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/console', mixin.ensureAuthenticated, function(req, res) {
  if (req.user.isAdmin) {
    res.render('console');
  } else {
    res.redirect('/slides');
  }
});

// start listen on port 3000
app.listen(app.get('port'), function() {
  console.log("Express server running on port " + app.get('port'));
});