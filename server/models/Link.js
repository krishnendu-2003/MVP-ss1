const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  email: String,
  brand: String,
  link: String,
  clickCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Link', linkSchema);


