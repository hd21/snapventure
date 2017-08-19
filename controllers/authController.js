const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/entries',
});

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.userLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    next();
    return;
  }
  req.flash('error', 'You must be logged in!');
  res.redirect('/login');
};
