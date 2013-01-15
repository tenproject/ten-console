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
app.use(express.static(__dirname + '/public'));
app.use(express.favicon());

// Express Middleware Stack
app.use(express.errorHandler());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({
  secret: 'ten console secret password',
  store: new RedisStore({
    host: 'lab.redistogo.com',
    port: 9405,
    username: 'redistogo',
    pass: '1561497803dcb7bc34e3e3931267b091'
  })
}));
app.use(passport.initialize());
app.use(passport.session());
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