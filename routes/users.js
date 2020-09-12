const express = require('express');
const router = express.Router();
const {
  userValidationRules,
  userValidationErrorHandling
} = require('../validators/validator');
const auth = require('../middleware/authenticator');
const isAdmin = require('../middleware/rolesAuthenticator');
const upload = require('../middleware/multer-config');

const {
  getAllUsers,
  addUser,
  getOneUser,
  deleteUser,
  updateUser,
  authenticateUser,
  loginUser,
  logoutUser,
  friendReq,
  accepteFriend,
  refuseFriend,
  removeFriend,
  updateUserImage
} = require('../controllers/usersController');

router
  .route('/')
  // .get(auth,isAdmin, getAllUsers)
  .get(getAllUsers)
  .post( upload.array('imgCollection', 3),userValidationRules(), userValidationErrorHandling, addUser);
  // userValidationRules(), userValidationErrorHandling,
router.route('/auth').get(auth, authenticateUser);
router.route('/login').post(loginUser);
router.route('/logout').post(auth, logoutUser);
router
  .route('/userImage')
  .put( auth,upload.array('imgCollection', 3), updateUserImage)

router.route('/:id').get( getOneUser)
router.route('/:id').delete(auth, deleteUser)
router.route('/:id').put(auth, updateUser);


router
  .route('/friend/:id')
  .put( auth, friendReq)
router
  .route('/accepteFriend/:id')
  .put( auth, accepteFriend)
router
  .route('/refuseFriend/:id')
  .put( auth, refuseFriend)
router
  .route('/removeFriend/:id')
  .put( auth, removeFriend)

module.exports = router;
