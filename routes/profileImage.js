const express = require("express");
const router = express.Router();
const {
  getAllProfileImage,
  getMyProfileImage,
  getOneProfileImage,
  deleteProfileImage,
  updateProfileImage,
  addProfileImage
} = require("../controllers/profileImageController");
const auth = require("../middleware/authenticator");
const isAdmin = require("../middleware/rolesAuthenticator");
const upload = require("../middleware/multer-config");

router
  .route("/")
  .get(getAllProfileImage)
  .post(auth, upload.array("imgCollection", 3), addProfileImage);

router.route("/my").get(auth, getMyProfileImage);

router
  .route("/:id")
  .get(getOneProfileImage)
  .delete(auth, isAdmin, deleteProfileImage)
  .put(auth, isAdmin, updateProfileImage);

module.exports = router;
