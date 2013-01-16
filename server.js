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

// Express Static Content
app.use(express.static(__dirname + '/public', { maxAge: 3600000 }));
app.use(express.favicon());

// Express Middleware Stack
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
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
app.use(passport.initialize());
app.use(passport.session());
app.use(express.csrf());
app.use(function (req, res, next) {
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

app.use(viewHandler());
app.use(login);
app.use(api);
app.use(users);
app.use(slides);
app.use(locations);
app.use(app.router);
app.use(express.compress());

app.get('/', function(req, res) {
  res.render('index', { user: req.user });
});

app.get('/console', mixin.ensureAuthenticated, function(req, res) {
  res.render('console', { user: req.user });
});

app.listen(app.get('port'), function () {
  console.log("Express server running on port " + app.get('port'));
});

process.on('uncaughtException', function(err) {
  console.error(err.stack);
});