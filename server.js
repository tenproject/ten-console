var express = require('express'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    RedisStore = require('connect-redis')(express);

var app         = express(),
    database    = require('./libs/database'),
    api         = require('./libs/api'),
    login       = require('./libs/login'),
    users       = require('./libs/users'),
    slides      = require('./libs/slides'),
    locations   = require('./libs/locations'),
    mixin       = require('./libs/mixin'),
    viewHandler = require('./libs/view');

// Express Configuration
app.set('port', 3000);
app.set('view engine', 'jade');
app.locals.pretty = true;


// Express Middleware Stack
// log
app.use(express.logger('dev'));

// compress response data with gzip/deflate
app.use(express.compress());

// serve static files
app.use(express.static(__dirname + '/public', { maxAge: 3600000 }));
app.use(express.favicon());

// error handler
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

process.on('uncaughtException', function(err) {
  console.error(err.stack);
});

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
app.use(function (req, res, next) {
  res.locals.csrftoken = req.session._csrf;
  next();
});

// parse request body
app.use(express.bodyParser());

// support _method (e.g. PUT in forms)
app.use(express.methodOverride());

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
app.use(viewHandler());

// ten app modules
app.use(login);
app.use(api);
app.use(users);
app.use(slides);
app.use(locations);

// route middleware
app.use(app.router);

app.get('/', function(req, res) {
  res.render('index', { user: req.user });
});

app.get('/console', mixin.ensureAuthenticated, function(req, res) {
  res.render('console', { user: req.user });
});

// start listen on port 3000
app.listen(app.get('port'), function () {
  console.log("Express server running on port " + app.get('port'));
});