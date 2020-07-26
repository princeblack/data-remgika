const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenticator');

const {getGroupChats} = require("../controllers/groupChatsController");

router
    .route('/:id')
    .get(auth, getGroupChats)




module.exports = router;