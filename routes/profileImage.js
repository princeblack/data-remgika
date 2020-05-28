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
  .post(auth, upload.array("imgCollection", 3), addProfileImage)
  .get(getOneProfileImage)


router.route("/profileImage").get(auth, getMyProfileImage);
router.route("/writer/:id").get(getOneProfileImage);

router
  .route("/:id")
  .delete(auth, isAdmin, deleteProfileImage)
  .put(auth, isAdmin, updateProfileImage);

module.exports = router;
