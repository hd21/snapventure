const mongoose = require('mongoose');
const Entry = mongoose.model('Entry');
const moment = require('moment');

const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const async = require('async');

exports.home = (req,res) => {
  res.render('home', { title: 'Snapventure' });
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

  res.render('dashboard', { title: 'Dashboard', entries, mainPage, count, pages, moment: moment });
};

// Retrieves Entry form
exports.createEntry_get = (req, res) => {
  res.render('editEntry', { title: 'Add Entry' });
};

exports.createEntry_post = async (req, res) => {

  req.checkBody('title', 'Please add a title.').notEmpty();
  req.checkBody('photo', 'Please add a photo.').notEmpty();
  req.checkBody('description', 'Please provide a description.').notEmpty();

  req.sanitize('title').escape();
  req.sanitize('description').escape();
  req.sanitize('title').trim();
  req.sanitize('description').trim();

  const entry = new Entry(req.body);
  await entry.save();
  res.status(201);
  res.redirect('/entries');
};

exports.getEntryById = async (req, res, next) => {
  const entry = await Entry.findOne( {_id: req.params.id });
  if (!entry) return next();
  res.render('entry', { entry, title: entry.title });
};

exports.updateEntry_get = async (req, res) => {
  const entry = await Entry.findOne({ _id: req.params.id });
  res.render('editEntry', { title: 'Edit Entry', entry });
};

exports.updateEntry_post = async (req, res) => {
  const entry = await Entry.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  res.redirect('/entries');
};

exports.deleteEntry = async (req, res) => {
  const deletedEntry = await Entry.findByIdAndRemove({  _id: req.params.id }).exec();
  console.log(req.params.id);
  res.redirect('/entries');
};
