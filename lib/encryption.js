const bcrypt = require('bcrypt');

exports.encrypt = async pass => {
  if (!pass) return '';
  return await bcrypt.hash(pass, 14);
};

exports.compare = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
