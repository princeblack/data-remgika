const mongoose = require('mongoose');
const { Schema } = mongoose;
const Address = require('./Address');

const EventSchema = new Schema(
  {
    imgCollection: {
      type: Array,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    participants:[{
      type:Schema.Types.ObjectId,
      ref: "User"
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', EventSchema);
