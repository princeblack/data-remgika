const express = require('express');
const router = express.Router();
const {
  userValidationRules,
  userValidationErrorHandling
} = require('../validators/validator');
const auth = require('../middleware/authenticator');
const isAdmin = require('../middleware/rolesAuthenticator');

const {
  getAllUsers,
  addUser,
  getOneUser,
  deleteUser,
  updateUser,
  authenticateUser,
  loginUser,
  logoutUser
} = require('../controllers/usersController');

router
  .route('/')
  .get(getAllUsers)
  .post(userValidationRules(), userValidationErrorHandling, addUser);

router.route('/me').get( authenticateUser);
router.route('/login').post(loginUser);
router.route('/logout').post( logoutUser);

router.route('/:id').get( getOneUser)
router.route('/:id').delete( deleteUser)
router.route('/:id').put( updateUser);

module.exports = router;
