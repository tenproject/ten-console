var express = require('express'),
    site = require('./site'),
    api = require('./api'),
    database = require('./database'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var app = express();

var users = [
  { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' },
  { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

passport.use(new LocalStrategy(
  function(username, password, done) {
    database.User.findOne({ username: username }, function (err, user) {
      console.log(user);
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  database.User.findOne({ username: username }, function(err, user) {
    console.log("logged in!");
    done(err, user);
  });
});

app.set('port', 3000);
app.set('view engine', 'jade');
app.locals.pretty = true;

app.use(express.errorHandler());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'ten console secret password' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/components'));

// Passport
app.get('/login', function(req, res) {
  res.render('login', { user: req.user });
});
app.post('/login', passport.authenticate('local', { successRedirect: '/console', failureRedirect: '/login' }));
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/register', function(req, res) {
  res.render('register', { user: req.user });
});

app.post('/register', function(req, res) {
  // Register a new user
  var user = new database.User({ username: req.param('username'), password: req.param('password') });
  user.save(function(err) {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// Site
app.get('/', site.index);
app.get('/api', site.api);
app.get('/console', ensureAuthenticated, site.console);

// Api
app.get('/api/ping', api.ping);

app.get('/api/slides', api.slides.listAll);
app.get('/api/slides/:id', api.slides.findById);
app.post('/api/slides', api.slides.create);

app.listen(app.get('port'), function () {
  console.log("Express server running on port " + app.get('port'));
});