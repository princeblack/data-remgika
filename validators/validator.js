const { body, validationResult } = require('express-validator');

const userValidationRules = () => {
  return [
    body('email')
      .isEmail()
      .exists()
      .normalizeEmail()
      .withMessage('Do you call this an email?'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Your password should be 6 characters long.'),
    body('firstName').trim(),
    body('lastName').trim()
  ];
};

const userValidationErrorHandling = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  res.status(422).json({ errors: errors.array() });
};

module.exports = {
  userValidationRules,
  userValidationErrorHandling
};
