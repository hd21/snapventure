const mongoose = require('mongoose');
const Entry = mongoose.model('Entry');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

exports.home = (req,res) => {
  res.render('home', { title: 'Express' });
};

exports.dashboard = async (req, res) => {
  const mainPage = req.params.page || 1;
  const limit = 10;
  const skip = (mainPage * limit) - limit;
  const entriesPromise = Entry
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ created: 'desc' });

  const countPromise = Entry.count();

  const [ entries, count ] = await Promise.all([entriesPromise, countPromise]);
  const pages = Math.ceil( count / limit );

  res.render('dashboard', { title: 'Dashboard', entries, mainPage, count, pages });
};

exports.addEntry = (req, res) => {
  res.render('editEntry', { title: 'Add Entry'});
};

exports.createEntry = async (req, res) => {
  const entry = new Entry(req.body);
  await entry.save();
  console.log('This should work!');
  res.redirect('/dashboard');
};

exports.updateEntry = async (req, res) => {
  const entry = await Entry.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  res.redirect(`/entries/${entry._id/edit}`);
};
