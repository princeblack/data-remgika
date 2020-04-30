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
  .get(auth,isAdmin, getAllUsers)
  .post(userValidationRules(), userValidationErrorHandling, addUser);

router.route('/auth').get(auth, authenticateUser);
router.route('/login').post(loginUser);
router.route('/logout').post(auth, logoutUser);

router.route('/:id').get(auth, getOneUser)
router.route('/:id').delete(auth, deleteUser)
router.route('/:id').put(auth, updateUser);

module.exports = router;
