var express = require('express'),
    site = require('./site'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    RedisStore = require('connect-redis')(express);

var app         = express(),
    api         = require('./libs/api'),
    database    = require('./libs/database'),
    pass        = require('./libs/passport'),
    login       = require('./libs/login'),
    slides      = require('./libs/slides'),
    mixin       = require('./libs/mixin'),
    viewHandler = require('./libs/view');

// Express Configuration
app.set('port', 3000);
app.set('view engine', 'jade');
app.locals.pretty = true;

// Express Static Content
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/components'));
app.use(express.favicon());

// Express Middleware Stack
app.use(express.errorHandler());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.compress());
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
app.use(pass);
app.use(login);
app.use(api);
app.use(slides);
app.use(app.router);

// Site
app.get('/', site.index);
app.get('/console', mixin.ensureAuthenticated, site.console);


app.listen(app.get('port'), function () {
  console.log("Express server running on port " + app.get('port'));
});