const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    groupName: {
      type: String,
      unique: true,
      required: true,
    },
    admin: [
      {
        adminUsers: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    confidentiality: {
      type: String,
      enum: ["Private", "Public"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('Group', GroupSchema);
