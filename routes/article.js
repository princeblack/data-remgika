const express = require("express");
const router = express.Router()
const { newArticle, getArtile , getArticlesByCity, getAllArticles, getMatchArticles, getUserArticles, updateArticle, saveArticle, deleteArticle} = require("../controllers/articleController");
const auth = require('../middleware/authenticator');
const upload = require("../middleware/multer-config");


router
  .route("/")
  .post(auth, upload.array("imgCollection", 6), newArticle)
  .get(getAllArticles)

router
  .route("/save/:id")
  .put(auth,saveArticle)
router
  .route("/title")
  .get(getMatchArticles)
router
  .route("/city")
  .get(getArticlesByCity)

router
  .route("/user/:id")
  .get(auth, getUserArticles)
router
  .route("/:id")
  .get(getArtile)
  .put(auth, upload.array("imgCollection", 6), updateArticle)
  .delete(auth, deleteArticle)






module.exports = router;