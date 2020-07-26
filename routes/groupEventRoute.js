const express = require('express');
const router = express.Router();
const {
  getAllGroupEventSchema,
  getOneGroupEventSchema,
  deleteGroupEventSchema,
  updateGroupEventSchema,
  addGroupEventSchema,
  getMyGroupEventSchemas,
} = require("../controllers/groupEventController");
const auth = require('../middleware/authenticator');
const isAdmin = require('../middleware/rolesAuthenticator');
const upload = require("../middleware/multer-config");

router
  .route("/")
  .get(getAllGroupEventSchema)
  .post(auth, upload.array("imgCollection", 3), addGroupEventSchema);

router.route("/userEvent").get(auth, getMyGroupEventSchemas);

router
  .route("/:id")
  .get(getOneGroupEventSchema)
  .delete(auth,  deleteGroupEventSchema)
  .put(auth, isAdmin, upload.array("imgCollection", 3), updateGroupEventSchema);

module.exports = router;