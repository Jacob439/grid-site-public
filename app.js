var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//Below decs added on
const mysql = require('mysql');
const bodyparser = require('body-parser');
app.use(bodyparser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//moved 404 from here to below

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var con = mysql.createConnection({
  host: "XXXX",
  user: "XXXX",
  password: "XXXX",
  database: "XXXX"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

});

//Now use regex here
app.get('/XXXX*', (req, res) => {
  let table = req.url.substring(1);
  table = table.replace(/[^a-z0-9_]/gi, '');
  console.log("req: " + req.url)
  var rawValues = "";
  let sql = "SELECT tile, color FROM " + table + " WHERE id IN (SELECT MAX(id) FROM " + table + " GROUP BY tile)";
  con.query(sql, function (err, result) {
    if (!err) {
      rawValues = result;
    } else {
      console.log(err);
    }
    res.send(rawValues);
  })
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
