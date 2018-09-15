const mongoose = require('mongoose');

const Pageschema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  conntent: {
    type: String,
    required: true,
  },
  conntent: {
    type: String,
    required: true,
  },
  sorting: {
    type: Number,
  },
});

module.exports = mongoose.model('Page', Pageschema);
