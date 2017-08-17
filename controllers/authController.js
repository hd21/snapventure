const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisift = require('es6-promisify');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed login',
  successRedirect: '/entries',
  successFlash: 'You are now logged in.'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You have successfully logged out!');
  res.redirect('/');
};
