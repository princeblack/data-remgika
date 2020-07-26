const express = require('express');
const router = express.Router();
const {
  getAllGroup,
  addGroup,
  getGroup,
  deleteGroup,
  joinGroup,
  publicGroups,
  updateGroup,
  getAllMembers
} = require('../controllers/groupController');
const auth = require('../middleware/authenticator');
const upload = require('../middleware/multer-config');

router
  .route('/')
  .get(getAllGroup)
  .post(auth,upload.array('imgCollection', 3), addGroup)
router
  .route("/members/:id")
  .get(getAllMembers)

router 
.route("/public")
    .get(publicGroups)

router
  .route('/:id')
  .put(auth,joinGroup)
  .get( getGroup)
  .delete(auth, deleteGroup)
  .put(auth, updateGroup);




module.exports = router;
