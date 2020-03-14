const express = require('express');
const router = express.Router();
const multer = require('../images/multer-config')
const {
  getAllPlaygrounds,
  getOnePlayground,
  deletePlayground,
  updatePlayground,
  addPlayground
} = require('../controllers/PlaygroundController');
const auth = require('../middleware/authenticator');
const isAdmin = require('../middleware/rolesAuthenticator');

router
  .route('/')
  .get( getAllPlaygrounds)
  .post(auth,multer, addPlayground);

router
  .route('/:id')
  .get(getOnePlayground)
  .delete(auth, isAdmin, deletePlayground)
  .put(auth, isAdmin, updatePlayground);

module.exports = router;
