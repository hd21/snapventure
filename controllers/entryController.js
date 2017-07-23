const mongoose = require('mongoose');
const Entry = mongoose.model('Entry');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

exports.home = (req,res) => {
  res.render('home', { title: 'Express' });
};

exports.dashboard = (req, res) => {
  res.render('dashboard');
};

exports.addEntry = (req, res) => {
  res.render('editEntry', { title: 'Add Entry'});
};

exports.createEntry = async (req, res) => {
  const entry = new Entry(req.body);
  await entry.save();
  res.redirect('/');
};
