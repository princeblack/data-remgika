const express = require("express");
const router = express.Router();
const { postGroupNews, getAllGRoupNews, deleteGroupNews} = require("../controllers/groupNewsController");
const auth = require("../middleware/authenticator");
const upload = require("../middleware/multer-config");
router
  .route("/")
  .post(auth, upload.array("imgCollection", 3), postGroupNews);
router
  .route('/:id')
  .get(getAllGRoupNews)
  .delete(auth, deleteGroupNews)



module.exports = router;
