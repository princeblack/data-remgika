const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    groupName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    admin: [
      {
          type: Schema.Types.ObjectId,
          ref: "User",
      },
    ],
    joindReq: [
      {
          type: Schema.Types.ObjectId,
          ref: "User",
      },
    ],
    confidentiality: {
      type: String,
      enum: ["Private", "Public"],
      required: true,
    },
    imgCollection: {
      type: Array,
      required: true,
    },
    members:{
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('Group', GroupSchema);
