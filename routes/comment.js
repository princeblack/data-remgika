const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticator');

const {addComment, getComment, deleteComment} = require('../controllers/commentController');

router
  .route("/")
  .get(getComment)
  .post(auth, addComment)

router
  .route("/:id")
  .get(getComment)
  .delete(auth,deleteComment)


module.exports = router;