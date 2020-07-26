const mongoose = require("mongoose");
const { Schema } = mongoose;

const GroupEventSchema = new Schema(
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
    groupId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GroupEvent", GroupEventSchema);
