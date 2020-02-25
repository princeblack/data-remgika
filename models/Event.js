const mongoose = require('mongoose');
const { Schema } = mongoose;
const Address = require('./Address');

const EventSchema = new Schema({
  imageUrl: { type: String, required: true },
  eventName: {
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
  date:{
      type: Date,
      required: true
  },
  Coorganizers:{
      type: String
  }
});

module.exports = mongoose.model('Event', EventSchema);
