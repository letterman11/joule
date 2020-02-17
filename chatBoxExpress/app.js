var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var registrationRouter = require('./routes/express_registration');
var authenticationRouter = require('./routes/express_authenticate');
var chatServerRouter = require('./routes/express_chat_server');
var msgServerRouter = require('./routes/express_ping_msg_server');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//create session with default 'MemoryStore'  -- do not use in real production
//use other express session solutions such as
// connect-sqlite3 
// express-mysql-session 

/*
var MySQLStore = require('express-mysql-session')(session);
 
var options = {
    host: 'localhost',
    port: 3306,
    user: 'session_test',
    password: 'password',
    database: 'session_test'
};
 
var sessionStore = new MySQLStore(options);
 
*/

app.use(session({
  secret: 'the list of possible outcomes in reverser order x790124',
  resave: false,
  saveUninitialized: true
}))

// ----------------------------------------------------------------------------
// middle-ware called each time on request from client -- real easy  coding flow
app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {}
  }
 
  // get the url pathname
  var pathname = parseurl(req).pathname
 
  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
 
  next()
})
// ---- end middle-ware session authentication -----------------------------
// -------------------------------------------------------------------------

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/chatterBox/registration', registrationRouter);
app.use('/chatterBox/authenticate', authenticationRouter);
app.use('/chatterBox/chat_sever', chatServerRouter);
app.use('/chatterBox/ping_msg_server', msgServerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


/*

require()
express()
app.set()
app.use()
module.exports

*/
