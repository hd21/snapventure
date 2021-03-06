exports.findErrors = (fn) => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

// catch 404 and forward to error handler
exports.notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

// error handler
exports.devError = (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
};
