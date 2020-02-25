const createError = require('http-errors');

const isAdmin = (req, res, next) => {
  console.log(req.user);
  const role = req.user.role;
  if (role !== 'Admin') throw new createError.NotFound();
  next();
  //   const isAdmin = role === 'Admin' ? next() : throw new createError.NotFound();
};

module.exports = isAdmin;
