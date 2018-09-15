const mongoose = require('mongoose');

const Pageschema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  sorting: {
    type: Number,
  },
});

module.exports = mongoose.model('Page', Pageschema);
