var express = require('express'),
    site = require('./site'),
    api = require('./api'),
    database = require('./database');

var app = express();

// Configure Express
app.configure(function() {
  app.locals.pretty = true;
  app.set('view engine', 'jade');
  app.use(express.errorHandler());
  app.use(express.logger('dev'));
  app.use(express.favicon());
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/components'));
  app.use(app.router);
});

// Local Routes
app.get('/', site.index);
app.get('/templates/:name', site.templates);

// API Routes
app.get('/api/ping', api.ping);
app.get('/api/slides', api.slides.listAll);
app.get('/api/slides/:id', api.slides.findById);
app.post('/api/slides', api.slides.create);

// Catch all other routes for Angular
app.get('*', site.index);

app.listen(3000);