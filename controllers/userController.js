const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login'} );
};

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' } );
};

exports.validateRegistration = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'Please enter a name.').notEmpty();
  req.checkBody('email', 'This e-mail is invalid.').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false
  });
  req.checkBody('password', 'Password cannot be blank.').notEmpty();

  const errors = req.validationErrors();
    if (errors) {
      req.flash('error', errors.map(err => err.msg));
      // res.render('register', { title: 'Registration', body: req.body, messages: req.flash('error') });
      res.render('register', { title: 'Registration', body: req.body, "messages": req.flash() });
      return;
    }
    next();
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};
