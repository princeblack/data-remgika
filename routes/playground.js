const express = require('express');
const router = express.Router();
const {
  getAllPlaygrounds,
  getMyPlaygrounds,
  getOnePlayground,
  deletePlayground,
  updatePlayground,
  addPlayground
} = require('../controllers/PlaygroundController');
const auth = require('../middleware/authenticator');
const isAdmin = require('../middleware/rolesAuthenticator');
const upload = require('../middleware/multer-config');

router
  .route('/')
  .get(getAllPlaygrounds)
  .post(auth, upload.array('imgCollection', 3), addPlayground);

router.route('/my').get(auth, getMyPlaygrounds);

router
  .route('/:id')
  .get(getOnePlayground)
  .delete(auth, isAdmin, deletePlayground)
  .put(auth, isAdmin, updatePlayground);

module.exports = router;
