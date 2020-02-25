const express = require('express');
const router = express.Router();
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
  .post( addPlayground);

router
  .route('/:id')
  .get(getOnePlayground)
  .delete(auth, isAdmin, deletePlayground)
  .put(auth, isAdmin, updatePlayground);

module.exports = router;
