const express = require('express');
const router = express.Router();
const {
  getAllPlaygrounds,
  getMyPlaygrounds,
  getOnePlayground,
  deletePlayground,
  updatePlayground,
  addPlayground,
  likeOnePlayground,
  unLikeOnePlayground
} = require('../controllers/PlaygroundController');
const auth = require('../middleware/authenticator');
const isAdmin = require('../middleware/rolesAuthenticator');
const upload = require('../middleware/multer-config');

router
  .route('/')
  .get(getAllPlaygrounds)
  .post(auth, upload.array('imgCollection', 3), addPlayground);

router.route('/userPlay').get(auth, getMyPlaygrounds);

router
  .route('/:id')
  .get(getOnePlayground)
  .delete(auth, isAdmin, deletePlayground)
  .put(auth, upload.array('imgCollection', 3), updatePlayground);

router
  .route('/like/:id')
  .put(auth, likeOnePlayground);

router
  .route('/unlike/:id')
  .put(auth, unLikeOnePlayground);
  


module.exports = router;
