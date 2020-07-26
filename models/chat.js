const mongoose = require("mongoose");
const { Schema } = mongoose;

const GroupChats = new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      groupId: {
        type: Schema.Types.ObjectId,
        ref: "Group",
      },
      message: {
        type: String,
        required: true,
      }
    },
    {
      timestamps: true,
    }
  );
  
  
  module.exports = mongoose.model('GroupChats', GroupChats);