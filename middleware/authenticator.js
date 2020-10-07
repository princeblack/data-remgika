const User = require('../models/User');
const createError = require('http-errors');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const user = await User.findByToken(token)
    .populate({
      path: "friendReq",
      select:
        "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
    })
    .populate({
      path: "event",
      select:
        "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
    })
    .populate({
      path: "group",
      select:
        "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
    })
    .populate({
      path: "friend",
      select:
        "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
    })
    .populate({
      path: "messagerUsers",
      select:
        "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
    })
    .select("-password -__v -tokens._id  -role -updatedAt -createdAt");
    if (!user) throw new createError.NotFound();

    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = auth;
