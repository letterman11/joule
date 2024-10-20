var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var parseurl = require('parseurl');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


/*--------- inclusion of CODE FOR REST PATHS/ROUTES ---------------*/
//------------------------------------------------------------------
// javascript functions to handle each route/path
//------------------------------------------------------------------

var indexRouter = require('./routes/index');
var registrationRouter = require('./routes/express_registration');
var authenticationRouter = require('./routes/express_authenticate');
var chatServerRouter = require('./routes/express_chat_server');
var msgServerRouter = require('./routes/express_ping_msg_server');
var app = express();

//-----------------------------------------------------------------
/*----------------------------------------------------------------*/


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// for parsing application/x-www-form-urlencoded | POST parameters
//app.use(express.urlencoded({ extended: true })) 

/*------------------------------------------------------------------------
|  @@@@@@@@@@@@@@@@@@@@@
|  SESSION CODE BLOCK
|  @@@@@@@@@@@@@@@@@@@@@
| create express-session with default 'MemoryStore'  -- do not use in real production
| use other express session solutions such as
|  + connect-sqlite3 
|  + express-mysql-session (MySQLStore)
|----------------------------------------------------------------------*/
var MySQLStore = require('express-mysql-session')(session);
var options = {
    //host: 'localhost',
    host: '192.168.1.33',
    port: 3306,
    user: 'dococt',
    password: 'dococt',
    database: 'dcoda_acme'
};

var sessionStore = new MySQLStore(options);
 
app.use(session({
  secret: 'the list of possible outcomes in reverser order x790124',
  resave: false,
  store: sessionStore, //MySQLStore specific
  cookie: {},
  saveUninitialized: true
}));


//@@ END SESSION CODE BLOCK 
//@@@@@@@@@@@@@@@@@@@@@@@@@@

/*-- MIDDLEWARE AUTHENTICATION  --------------------------------------------------
| middle-ware called each time on request from client -- REAL EASY CODING FLOW   |
--------------------------------------------------------------------------------*/
function customAuthen(req, res, next) {
  
  if((req.session.chatSessionID) && req.session.chatSessionID == req.session.id) 
  { 
     //console.log("Auth middleware ", req.session.chatSessionID);
     next();
  } else { res.statusCode = 401;   
     //res.send("Unauthorized");
     res.send("Not Authorized");
  }  
 
}
/* - END MIDDLEWARE AUTHENTICATION
/* ------------------------------------------------------------------------- */

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*----------------- REST PATHS  ----------------------------*/
//-----------------------------------------------------------
app.use('/', indexRouter);
app.use('/expressChat/registration', registrationRouter);
app.use('/expressChat/authenticate', authenticationRouter);
app.use(customAuthen);
app.use('/expressChat/chat_server', chatServerRouter);
app.use('/expressChat/ping_msg_server', msgServerRouter);
//-----------------------------------------------------------
/*------------------ REST PATHS  --------------------------*/

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
