const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const entrySchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Please enter a title.'
  },
  entered: {
    type: Date,
    default: Date.now
  },
  photo: String,
  description: {
    type: String,
    required: 'Please enter a description.'
  }
});

module.exports = mongoose.model('Entry', entrySchema);
