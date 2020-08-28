const mongoose = require("mongoose");
const { Schema } = mongoose;

const PlaygroundSchema = new Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    imgCollection: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    like: {
      type: Number,
      default: 0
    },
    unlike: {
      type: Number,
      default: 0
    },
    likeUser: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    unLikeUser:[ {
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Playground", PlaygroundSchema);
