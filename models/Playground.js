const mongoose = require('mongoose');
const { Schema } = mongoose;
const Address = require('./Address');

const PlaygroundSchema = new Schema({
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  title: {
    type: String,
    required: true
  },
  address: {
    type: Address,
    required: true
  },
  description: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Playground', PlaygroundSchema);
