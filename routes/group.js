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
  getAllMembers,
  addAdmin,
  removeAdmin,
  removeMembers,
  joinGroupRequest,
  joinGroupRefused,
  updateGroupPicture
} = require('../controllers/groupController');
const auth = require('../middleware/authenticator');
const upload = require('../middleware/multer-config');

router
  .route('/')
  .get(getAllGroup)
  .post(auth,upload.array('imgCollection', 3), addGroup)

router 
  .route("/public")
  .get(publicGroups)

router
  .route('/:id')
  .get(getGroup)
  .delete(auth, deleteGroup)
  .put(auth,upload.array('imgCollection', 3), updateGroup)

router 
  .route("/picture/:id")
  .put(auth,upload.array('imgCollection', 3),updateGroupPicture)
router
  .route("/members/:id")
  .get(getAllMembers)

router
    .route('/join/:id')
    .put(auth,joinGroup)
router
    .route('/joinRefused/:id')
    .put(auth,joinGroupRefused)

router
  .route("/addNewAdmin/:id")
  .put(auth, addAdmin)

router
  .route("/removeAdmin/:id")
  .put(auth, removeAdmin)
router
  .route("/removeMember/:id")
  .put(auth, removeMembers)
router
  .route("/joinGroupRequest/:id")
  .put(auth, joinGroupRequest)


module.exports = router;
