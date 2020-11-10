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
    location:{
      type:{
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates:{
        type: [Number],
        required: true
      }
    },
    userId: {
      type: String,
    },
    groupId: {
      type: String,
    },
    participants:[{
      type:Schema.Types.ObjectId,
      ref: "User"
    }],
    participantsNumber:{
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

  EventSchema.index({
  location: "2dsphere"
})


module.exports = mongoose.model('Event', EventSchema);
