const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const encryption = require("../lib/encryption");
const env = require("../config/config");

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    acceptTerms:{
      type: Boolean
    },
    verificationToken:{
      type: String
    },
    verified:{
      type: Date
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      required: true
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
    resetToken: {
      token: String,
      expires: Date
    },
    passwordReset:{
      type: Date
    },
    friend:[{
      type:Schema.Types.ObjectId,
      ref: "User"
    }],
    friendId:[{
      type:Schema.Types.ObjectId,
      ref: "User"
    }],
    friendReq:[{
      type:Schema.Types.ObjectId,
      ref: "User"
    }],
    friendReqId:[{
      type:Schema.Types.ObjectId,
      ref: "User"
    }],
    group:[{
      type:Schema.Types.ObjectId,
      ref: "Group"
    }],
    groupLike:[{
      type:Schema.Types.ObjectId,
      ref: "Group"
    }],
    event:[{
      type:Schema.Types.ObjectId,
      ref: "Event"
    }],
    eventLike:[{
      type:Schema.Types.ObjectId,
      ref: "Event"
    }],
    like:[{
      type:Schema.Types.ObjectId,
      ref: "Like"
    }],
    messagerUsers:[{
      type:Schema.Types.ObjectId,
      ref: "User"
    }],
    imgCollection: {
      type: Array,
      required: true
    }

  },
  {
    timestamps: true
  }
);
UserSchema.index({
  location: "2dsphere"
});
UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = "x-auth";

  const token = jwt
    .sign({ _id: user._id.toHexString(), access }, env.jwt_key)
    .toString();

  return token;
};

UserSchema.methods.checkPassword = async function(password) {
  const user = this;
  return await encryption.compare(password, user.password);
};

UserSchema.methods.getPublicFields = function() {
  return {
    _id: this._id,
    lastName: this.lastName,
    firstName: this.firstName,
    email: this.email,
    group: this.group,
    role: this.role,
    imgCollection: this.imgCollection,
    messagerUsers: this.messagerUsers,
    city: this.city,
    location: this.location
  };
};

UserSchema.statics.findByToken = function(token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, env.jwt_key);
  } catch (err) {
    return;
  }

  return User.findOne({
    _id: decoded._id
  });
};

UserSchema.pre("save", async function(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  this.password = await encryption.encrypt(this.password);
  next();
});

module.exports = mongoose.model("User", UserSchema);
