const mongoose = require('mongoose');

const Image = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('images', Image);
