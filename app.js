var express = require('express'),
    hbs = require('hbs'),
    app = express();
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    request = require('request'),
    RedisStore = require('connect-redis')(express),
    async = require('async');

////////////////////////////////////////////////
// Express Configuration
////////////////////////////////////////////////
app.configure(function() {
  app.set('port', process.argv[2] || process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.static(__dirname + '/public'), { maxAge: 300000 });
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
  app.use(function (req, res, next) {
    if (req.user) {
      req.callAPI = callAPI;
      res.locals.user = req.user;
    }
    next();
  });
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

////////////////////////////////////////////////
// Handlers
////////////////////////////////////////////////

var callAPI = function (prop, callback) {
  var options = {
    method: prop.method,
    uri: 'http://'+this.session.passport.user.username+':'+this.session.passport.user.password+'@localhost:3001' + prop.endpoint,
    json: true
  }

  request(options, function (err, r, body) {
    if (err) {
      return new Error(err);
    }

    if (body && body.error) {
      return callback(body);
    }

    return callback(null, body);
  });
};

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

////////////////////////////////////////////////
// Handlebars
////////////////////////////////////////////////
var blocks = {};

hbs.registerHelper('extend', function(name, context) {
  var block = blocks[name];
  if (!block) {
    block = blocks[name] = [];
  }

  block.push(context(this));
});

hbs.registerHelper('block', function(name) {
  var val = (blocks[name] || []).join('\n');

  // clear the block
  blocks[name] = [];
  return val;
});

hbs.registerHelper('properties', function(obj, options) {
  var out = "<ul>";

  for(var i in obj) {
    out = out + "<li>" + i + ": " + obj[i] + "</li>";
  }

  return out + "</ul>";
});

hbs.registerHelper('list', function(items, options) {
  var out = "<ul>";

  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<li>" + options.fn(items[i]) + "</li>";
  }

  return out + "</ul>";
});

////////////////////////////////////////////////
// Passport
////////////////////////////////////////////////
passport.use(new LocalStrategy(
  function(username, password, done) {
    // User.findOne({ username: username }, function(err, user) {
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
    //   return done(null, user);
    // });
    var options = {
      method: 'GET',
      uri: 'http://' + username + ':' + password + '@localhost:3001/users/' + username,
      json: true
    }
    request(options, function (err, res, body) {
      if (body && body.error) {
        console.log(body.payload);
        return done(null, false, { message: body.payload });
      }

      body['password'] = password;

      return done(null, body);
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log(user.username + " logged in");
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  var options = {
    method: 'GET',
    uri: 'http://'+user.username+':'+user.password+'@localhost:3001/users/' + user.username,
    json: true
  };

  request(options, function (err, res, body) {
    if (body && body.error) {
      console.log(body.payload);
      return done(null, false, { message: body.payload });
    }

    return done(err, body);
  });
});

app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

////////////////////////////////////////////////
// Router
////////////////////////////////////////////////
app.get('/', function (req, res) {
  if (!req.user) {
    return res.render('index');
  }

  async.waterfall([
    function (callback) {
      var options = {
        method: 'GET',
        endpoint: '/organizations'
      };

      req.callAPI(options, function (err, body) {
        if (err || body.error) {
          return callback(err);
        }
        callback(null, body);
      });
    },
    function (orgs, callback) {
      var locationsArray = [];

      function work(organization) {
        return function (cb) {
          var options = {
            method: 'GET',
            endpoint: '/locations/' + organization
          };

          req.callAPI(options, function (err, body) {
            if (err || body.error) {
              return cb(err);
            }
            cb(null, body);
          });
        }
      };

      for (var i=0; i < orgs.length; i++) {
        locationsArray.push(new work(orgs[i].id));
      }

      async.parallel(locationsArray,
      // optional callback
      function(err, results) {
        callback(null, orgs, results);
      });
    }
  ],
  // final callback
  function(err, orgs, locations) {
    if (err) {
      return res.send(err);
    }

    res.locals.organizations = orgs;
    res.locals.locations = locations;
    res.render('index');
  });
});

app.get('/user/:username', ensureAuthenticated, function (req, res) {
  var options = {
    method: 'GET',
    endpoint: '/users/' + req.param('username')
  };

  req.callAPI(options, function (err, body) {
    if (err || body.error) {
      return res.send(err);
    }

    res.locals.profile = body;
    return res.render('profile');
  });
});

app.get('/:organization', ensureAuthenticated, function (req, res) {
  async.parallel({
    organization: function (callback) {
      var options = {
        method: 'GET',
        endpoint: '/organizations/' + req.param('organization')
      };

      req.callAPI(options, function (err, body) {
        if (err || body.error) {
          return callback(err);
        }

        return callback(null, body);
      });
    },
    locations: function (callback) {
      var options = {
        method: 'GET',
        endpoint: '/locations/' + req.param('organization')
      };

      req.callAPI(options, function (err, body) {
        if (err || body.error) {
          return callback(err);
        }

        return callback(null, body);
      });
    },
    slides: function (callback) {
      var options = {
        method: 'GET',
        endpoint: '/slides/' + req.param('organization') + "/slides"
      };

      req.callAPI(options, function (err, body) {
        if (err || body.error) {
          return callback(err);
        }
        console.log(body);
        return callback(null, body);
      });
    }
  },
  function (err, results) {
    res.locals.organization = results.organization;
    res.locals.locations = results.locations;
    res.locals.slides = results.slides;
    return res.render('organization');
  });
});

app.get('/:organization/:location', ensureAuthenticated, function (req, res) {
  async.parallel({
    location: function (callback) {
      var options = {
        method: 'GET',
        endpoint: '/locations/' + req.param('organization') + '/' + req.param('location')
      };

      req.callAPI(options, function (err, body) {
        // if (err) {
        //   return callback(err);
        // }

        return callback(null, body);
      });
    },
    slides: function (callback) {
      var options = {
        method: 'GET',
        endpoint: '/slides/' + req.param('organization') + '/slides?location=' + req.param('location')
      };

      req.callAPI(options, function (err, body) {
        // if (err) {
        //   return callback(err, body);
        // }

        return callback(null, body);
      });
    },
  },
  // final callback
  function (err, results) {
    console.log(results.location);
    console.log(results.slides);
    res.locals.location = results.location;
    res.locals.slides = results.slides;
    return res.render('location');
  });
});

////////////////////////////////////////////////
// HTTP Server
////////////////////////////////////////////////
app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
