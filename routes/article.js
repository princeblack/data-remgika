const express = require("express");
const router = express.Router()
const { newArticle, getArtile , getArticlesByCity, getAllArticles, getMatchArticles} = require("../controllers/articleController");
const auth = require('../middleware/authenticator');
const upload = require("../middleware/multer-config");


router
  .route("/")
  .post(auth, upload.array("imgCollection", 6), newArticle)
  .get(getAllArticles)

router
  .route("/title")
  .get(getMatchArticles)
router
  .route("/city")
  .get(getArticlesByCity)
router
  .route("/:id")
  .get(getArtile)





module.exports = router;