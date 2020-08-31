const express = require('express');
const router = express.Router();
const {
  getAllEvent,
  getOneEvent,
  deleteEvent,
  updateEvent,
  addEvent,
  getMyEvents,
  joinEvent,
} = require("../controllers/eventController");
const auth = require('../middleware/authenticator');
const isAdmin = require('../middleware/rolesAuthenticator');
const upload = require("../middleware/multer-config");

router
  .route("/")
  .get(getAllEvent)
  .post(auth, upload.array("imgCollection", 3), addEvent);

router.route("/userEvent").get(auth, getMyEvents);

router
  .route("/:id")
  .get(getOneEvent)
  .delete(auth, isAdmin, deleteEvent)
  .put(auth, isAdmin, upload.array("imgCollection", 3), updateEvent);

router
  .route("/participation/:id")
  .put(auth, joinEvent);


module.exports = router;