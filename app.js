const { Pool, Client } = require('pg');

const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'postgres',
	password: 'postgres',
	port: 5432
});


pool.query('select * from hello', (err, res) => {
  console.log(res.rows[0].id, res.rows[1].greeting)
  pool.end()
});

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var kakaoPayApproval = require('./routes/kakaoPay/approval');
var kakaoPayCancel = require('./routes/kakaoPay/cancel');
var kakaoPayFail = require('./routes/kakaoPay/fail');

//Route to Restaurant
var restaurantRouter = require('./routes/getRestaurants');
var menusRouter = require('./routes/menus');
var shoppingCartRouter = require('./routes/cart');
var delivLocationRouter = require('./routes/location');
var purchaseSummaryRouter = require('./routes/purchase_summary')

var userAPI = require('./routes/api/users.js');
var authAPI = require('./routes/api/auth.js');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', userAPI);
app.use('/auth', authAPI);

app.use('/restaurants', restaurantRouter);
app.use('/menus', menusRouter);
app.use('/cart', shoppingCartRouter);
app.use('/location', delivLocationRouter);
app.use('/purchase_summary', purchaseSummaryRouter);

app.use('/Oauth/approval', kakaoPayApproval);
app.use('/Oauth/cancel', kakaoPayCancel);
app.use('/Oauth/fail', kakaoPayFail);

app.use('/static', express.static('public/images/drawable-hdpi/'));

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


//favicon.ico 404 방지
app.use( function(req, res, next) {

  if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
    return res.sendStatus(204);
  }

  return next();

});

module.exports = app;
