const {getMessage, unread, getAllUserThatIChatWith , readMsg} = require('../controllers/messager');
const auth = require('../middleware/authenticator');
const express = require("express");
const router = express.Router()

router
    .route('/getChatMembers')
    .get(auth, getAllUserThatIChatWith )

router
    .route('/:id')
    .get(auth, getMessage )
    .put(auth,readMsg)



module.exports = router