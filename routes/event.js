const express = require('express');
const router = express.Router();
const {
    getAllEvent,
    getOneEvent,
    deleteEvent,
    updateEvent,
    addEvent
} = require('../controllers/eventController');
const auth = require('../middleware/authenticator');
const isAdmin = require('../middleware/rolesAuthenticator');

router
  .route('/')
  .get( getAllEvent)
  .post( addEvent);

router
  .route('/:id')
  .get(getOneEvent)
  .delete(auth, isAdmin, deleteEvent)
  .put(auth, isAdmin, updateEvent);

module.exports = router;