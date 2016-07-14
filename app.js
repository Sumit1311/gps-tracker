var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var db = require(process.cwd() + "/db/api");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var dummyCoordinates = {
    "lattitude": 23.0934,
    "longitude": 30.6460
};

app.use("/getCoordinates", function (req, res) {
    db.coordinates.getCoordinates("1")
        .then(function (result) {
            if (result.length > 0) {
                dummyCoordinates.lattitude = result[0].lattitude;
                dummyCoordinates.longitude = result[0].longitude;
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(dummyCoordinates));
            res.end();
        });
    //res.end(JSON.stringify(dummyCoordinates));
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
