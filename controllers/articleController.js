const Articles = require("../models/Articles");
const createError = require("http-errors");
const fs = require("fs");
const { send } = require("process");
const User = require("../models/User");

Articles.createIndexes({title: "text"})
Articles.createIndexes({location: "2dsphere"})


exports.newArticle = async (req, res, next) => {
  try {
    const reqFiles = [];
    const url = "https://" + req.get("host");
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
  } catch (error) {
    next(error);
  }
};
exports.saveArticle = async (req, res, next) => {
  try {
    const findSave = await Articles.find({
      _id: req.params.id,
      articlesSave: { $in: [req.user._id] },
    });
    if (findSave.length === 0) {
      const user = await Articles.updateOne(
        { _id: req.params.id },
        { $addToSet: { articlesSave: req.user._id } }
      );
      res.status(200).send(user);
    } else {
      const user = await Articles.updateOne(
        { _id: req.params.id },
        { $pull: { articlesSave: req.user._id } }
      );
      res.status(200).send(user);
    }
  } catch (error) {
    next(error);
  }
};
exports.deleteArticle = async (req, res, next) => {
  try {
    const image = await Articles.findOne({ _id: req.params.id });
    const filename = image.imgCollection;
    for (var i = 0; i < filename.length; i++) {
      // deleting the files works perfectly
      const file = filename[i].slice(36);
      fs.unlink(`public/images/${file}`, async () => {});
    }
    const users = await Articles.findByIdAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    res.status(200).send({ message: "article is deteled" });
  } catch (error) {
    next(error);
  }
};

exports.updateArticle = async (req, res, next) => {
  try {
  
    const reqFiles = [];
    if (req.files.length > 0) {
      const image = await Articles.findOne({ _id: req.params.id });
      const filename = image.imgCollection;
      for (var i = 0; i < filename.length; i++) {
        // deleting the files works perfectly
        const file = filename[i].slice(36);
        fs.unlink(`public/images/${file}`, async () => {});
        const remove = Articles.updateOne({ _id: req.params.id },{$pull: {imgCollection: filename[i]}})
      }
      const url = "https://" + req.get("host");
      for (var i = 0; i < req.files.length; i++) {
        reqFiles.push(url + "/static/images/" + req.files[i].filename);
      }
    }

    if (req.files.length === 0) {
      const image = await Articles.findOne({ _id: req.params.id });
      const filename = image.imgCollection;
      const url = "https://" + req.get("host");
      for (var i = 0; i < filename.length; i++) {
        // deleting the files works perfectly
        const file = filename[i].slice(36);
        reqFiles.push(url + "/static/images/" + file);
      }
    }

    const letSplit = req.body.location.split(",");
    const lng = parseFloat(letSplit[0]);
    const lat = parseFloat(letSplit[1]);
    const resultat = new Array(lng, lat);
    const denver = { type: "Point", coordinates: resultat };
    const newArticle = req.files || req.files.length === 0
      ? {
          ...req.body,
          location: denver,
          imgCollection: reqFiles,
        }
      : {
          ...req.body,
          location: denver,
        };

    const articles = await Articles.updateMany(
      {
        _id: req.params.id,
      },
      {
        ...req.body,
          location: denver,
          imgCollection: reqFiles,
        _id: req.params.id,
      }
    );
    res.status(200).send(articles);
    console.log(articles);
  } catch (error) {
    next(error);
  }
};

exports.getArtile = async (req, res, next) => {
  try {
    const artile = await Articles.findById({ _id: req.params.id }).populate("userId");;
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
    const skip = req.query.skip;
    const pageSize = 12;
    const pageNum = pageSize * (skip - 1);

    if (title && city) {
      const count = await Articles.find(
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
      ).limit(120);
      const total = count.length;

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
      )
      .sort({ score: { $meta: "textScore" } })
      .skip(pageNum)
      .limit(pageSize)

      res.status(200).send({ articles: articles , count: total });

    } else if (city && !title) {
      const count = await Articles.find({
        prixOption: option,
        location: {
          $geoWithin: {
            $centerSphere: [[lng, lat], distance / 3963.2],
          },
        },
      }).limit(120)
      const total = count.length;
      const articles = await Articles.find({
        prixOption: option,
        location: {
          $geoWithin: {
            $centerSphere: [[lng, lat], distance / 3963.2],
          },
        },
      }).skip(pageNum)
      .limit(pageSize)

      res.status(200).send({ articles: articles , count: total });
    } else if (!city && !title) {
      const count = await Articles.aggregate([{ $sample: { size: 10 } },{$limit:120}])
      const total = count.length;
      const articles = await Articles.aggregate([{ $sample: { size: 10 } },{$skip : pageNum},{$limit : pageSize}]);
      res.status(200).send({ articles: articles , count: total });
    }
  } catch (error) {
    next(error);
  }
};

exports.getMatchArticles = async (req, res, next) => {
  const title = req.query.title;
  try {
    const articles = await Articles.aggregate([
      { $match: { $text: { $search: title } } },
      { $project: { title: 1, _id: 1, score: { $meta: "textScore" } } },
      { $match: { score: { $gt: 1.0 } } },
    ])
      .sort({ score: { $meta: "textScore" } })
      .limit(10);
    res.status(200).send(articles);
  } catch (error) {
    next(error);
  }
};
exports.getUserArticles = async (req, res, next) => {
  try {
    const articles = await Articles.find({ userId: req.params.id }).sort(
      "createdAt"
    );
    res.status(200).send(articles);
  } catch (error) {
    next(error);
  }
};
