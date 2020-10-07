const {getMessage, unread} = require('../controllers/messager');
const auth = require('../middleware/authenticator');
const express = require("express");
const router = express.Router()


router
    .route('/:id')
    .get(auth, getMessage )

router
    .route('/unread/:id')
    .get(auth, unread )
module.exports = router