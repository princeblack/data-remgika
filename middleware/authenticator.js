const User = require('../models/User');
const createError = require('http-errors');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const user = await User.findByToken(token).select("-password -__v -tokens._id  -role -updatedAt -createdAt");
    if (!user) throw new createError.NotFound();

    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = auth;
