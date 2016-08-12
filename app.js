//test
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var mongoose =require('mongoose');

mongoose.connect("mongodb://test:hssjs!@ds153845.mlab.com:53845/mongodbtest714");
var db = mongoose.connection;
db.once("open",function(){
  console.log("DB conn");
});
db.on("error",function (err) {
  console.log("DB err");
});

var dataSchema = mongoose.Schema({
  name:String,
  count:Number
}); //mongoose.Schema()함수 는 object 를 인 자로 받 아  그 object 를 스키마 를 만듭니다.

var Data = mongoose.model('data',dataSchema);
Data.findOne({name:"myData"},function(err,data){
  if(err) return console.log("Data Error",err);
  if(!data){
    Data.create({name:"myData",count:0},function(err,data){
      if(err) return console.log("Data Error",err);
      console.log("Counter initialized",data);
    });
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
