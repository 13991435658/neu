var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login')
var AuthMiddleware = require('./middlewares/Auth')
var userRouter = require('./routes/user')
var bodyParser = require('body-parser')
var marketRouter = require('./routes/market')
const lostfoundRouter = require('./routes/lostfound')
var topicRouter = require('./routes/topic')
var uploadImgRouter = require('./routes/uploadImg');
const RefreshToken = require('./middlewares/RefreshToken');
const { decode } = require('jsonwebtoken');

var app = express();
app.use(bodyParser.json())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/savelogin', (req, res) => {
  const { accessToken } = req.query
  const decoded = decode(accessToken)
  if (decoded) {
    delete decoded.iat
    delete decoded.exp
    res.send({
      ok: 1,
      userInfo: decoded
    })
  } else {
    res.send({
      ok: 1,
      message: '需要登录'
    })
  }
})
app.use(loginRouter)
app.use(registerRouter)
app.use(uploadImgRouter)
app.post('/api/refreshtoken', RefreshToken)
app.use(AuthMiddleware)
app.use(userRouter)
app.use(marketRouter)
app.use(lostfoundRouter)
app.use(topicRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
