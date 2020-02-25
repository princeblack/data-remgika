const express = require('express');
const router = express.Router();
const {
  getAllGroup,
  addGroup,
  getGroup,
  deleteGroup,
  updateGroup
} = require('../controllers/groupController');
const auth = require('../middleware/authenticator');

router
  .route('/')
  .get(auth, getAllGroup)
  .post(auth, addGroup);

router
  .route('/:id')
  .get(auth, getGroup)
  .delete(auth, deleteGroup)
  .put(auth,   updateGroup);

module.exports = router;
