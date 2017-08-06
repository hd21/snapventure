const mongoose = require('mongoose');
const Entry = mongoose.model('Entry');
const moment = require('moment');
const async = require('async');

const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');


const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next){
    const thePhoto = file.mimetype.startsWith('image/');
    if (thePhoto) {
      next(null, true);
    } else {
      next({ message: `Sorry, but that file type isn\'t allowed!` }, false);
    }
  }
};

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

exports.uploadPhoto = multer(multerOptions).single('photo');

exports.resizePhoto = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(500, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
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
