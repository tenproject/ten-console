var express = require('express'),
    site = require('./site'),
    api = require('./api'),
    database = require('./database');

var app = express();

app.set('view engine', 'jade');
app.locals.pretty = true;

app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.use(express.static(__dirname + '/public'), { maxAge: 36000 });
app.use(express.static(__dirname + '/components'), { maxAge: 36000 });

app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

app.get('/', site.index);
app.get('/api', site.api);

app.get('/api/ping', api.ping);

app.get('/api/slides', api.slides.listAll);
app.get('/api/slides/:id', api.slides.findById);
app.post('/api/slides', api.slides.create);

// Catch unhandled errors
process.on('uncaughtException', function(err) {
  console.log(err);
});

app.listen(3000);