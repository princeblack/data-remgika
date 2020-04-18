const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProfileImageSchema = new Schema(
  {
    userID: {
      type: String,
      required: true
    },
    imgCollection: {
      type: Array,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("ProfileImage", ProfileImageSchema);
