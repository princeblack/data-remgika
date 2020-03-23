const mongoose = require('mongoose');
const { Schema } = mongoose;

const PlaygroundSchema = new Schema({
  userID: {
    type: String,
    required: true
  },
  imageUrl:{
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Playground', PlaygroundSchema);
