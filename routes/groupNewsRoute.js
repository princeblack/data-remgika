const express = require("express");
const router = express.Router();
const { postGroupNews, getAllGRoupNews} = require("../controllers/groupNewsController");
const auth = require("../middleware/authenticator");
const upload = require("../middleware/multer-config");
router
  .route("/")
  .post(auth, upload.array("imgCollection", 3), postGroupNews);
router
  .route('/:id')
  .get(getAllGRoupNews)


module.exports = router;
