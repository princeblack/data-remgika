const mongoose = require("mongoose");
const { Schema } = mongoose;

const Article = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    imgCollection: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    prixOption: {
      type: String,
      required: true,
    },
    city: {
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
    description: {
      type: String,
      required: true,
    },
    sold: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
Article.index(
  {title: "text"}
  )
Article.index({
  location: "2dsphere"
})
module.exports = mongoose.model("articles", Article);
