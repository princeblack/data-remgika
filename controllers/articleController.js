const Articles = require("../models/Articles");
const createError = require("http-errors");
const fs = require("fs");
const { send } = require("process");

exports.newArticle = async (req, res, next) => {
  try {
    const reqFiles = [];
    const url = "http://" + req.get("host");
    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(url + "/static/images/" + req.files[i].filename);
    }
    const letSplit = req.body.location.split(",");
    const lng = parseFloat(letSplit[0]);
    const lat = parseFloat(letSplit[1]);
    const resultat = new Array(lng, lat);
    const denver = { type: "Point", coordinates: resultat };
    const article = new Articles({
      ...req.body,
      title: `${req.body.title}`,
      description: `${req.body.description}`,
      imgCollection: reqFiles,
      userId: req.user._id,
      location: denver,
    });
    await article.save();
    res.status(200).send(article);
    console.log(article);
  } catch (error) {
    next(error);
  }
};

exports.getArtile = async (req, res, next) => {
  try {
    const artile = await Articles.findById({ _id: req.params.id });
    res.status(200).send(artile);
  } catch (error) {
    next(error);
  }
};

exports.getAllArticles = async (req, res, next) => {
  try {
    const articles = await Articles.find().populate("userId");
    res.status(200).send(articles);
  } catch (error) {
    next(error);
  }
};

exports.getArticlesByCity = async (req, res, next) => {
  try {
    const title = req.query.title;
    const option = req.query.option;
    let distance = parseInt(req.query.distance);
    const city = req.query.city;

    if (distance === 5) {
      distance = 3.10686;
    } else if (distance == 10) {
      distance = 6.21371;
    } else if (distance == 20) {
      distance = 12.4274;
    } else if (distance == 30) {
      distance = 18.6411;
    } else if (distance == 50) {
      distance = 31.0686;
    } else if (distance == 100) {
      distance = 62.1371;
    } else if (distance == 200) {
      distance = 124.274;
    }
    const letSplit = req.query.city.split(",");
    const lng = parseFloat(letSplit[0]);
    const lat = parseFloat(letSplit[1]);

    if (title && city) {
      const articles = await Articles.find(
        {
          $text: { $search: title },
          prixOption: option,
          location: {
            $geoWithin: {
              $centerSphere: [[lng, lat], distance / 3963.2],
            },
          },
        },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });

      res.status(200).send(articles);
    } else if (city && !title) {
      const articles = await Articles.find({
        prixOption: option,
        location: {
          $geoWithin: {
            $centerSphere: [[lng, lat], distance / 3963.2],
          },
        },
      });

      res.status(200).send(articles);
    } else if (!city && !title) {
      const articles = await Articles.aggregate([{$sample: {size: 10 }}])
      res.status(200).send(articles);
    }
  } catch (error) {
    next(error);
  }
};

exports.getMatchArticles = async (req,res,next)=>{
  const title = req.query.title;
  try {
    const articles = await  Articles.aggregate([
      {$match:{$text: {$search: title}}},
      {$project: {title: 1, _id:1, score: {$meta : "textScore"}}},
      { $match: { score: { $gt: 1.0 } } }
    ])
    .sort({ score: { $meta: "textScore" } })
    .limit(10)
    res.status(200).send(articles)
  } catch (error) {
    next(error)
  }
}
exports.getUserArticles = async (req,res,next) =>{
  try {
    const articles = await Articles.find({userId: req.params.id}).sort('createdAt')
    res.status(200).send(articles)
  } catch (error) {
    next(error)
  }
}