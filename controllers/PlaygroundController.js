const Playground = require("../models/Playground");
const createError = require("http-errors");
const fs = require("fs");

exports.getAllPlaygrounds = async (req, res, next) => {
  try {
    const total= await Playground.countDocuments()
    let {skip= 0, limit = 10}= req.query
    skip = Number(skip) || 0;
    limit = Number(limit) || 10;
    skip = skip < 0 ? 0 : skip;
    limit = Math.min(50, Math.max(1, limit));
 
    const playgrounds = await Playground.find()
      .skip(skip)
      .limit(limit)
      .sort("createdAt")
      .select("-__v");
    res.status(200).send(playgrounds);
  } catch (e) {
    next(e);
  }
};

exports.getMyPlaygrounds = async (req, res, next) => {
  try {
    const playgrounds = await Playground.find({ userID: req.user._id }).select(
      "-__v"
    );
    res.status(200).send(playgrounds);
  } catch (e) {
    next(e);
  }
};

exports.getOnePlayground = async (req, res, next) => {
  try {
    const playground = await Playground.findById(req.params.id).select("-__v");
    if (!playground) throw new createError.NotFound();
    res.status(200).send(playground);
  } catch (e) {
    next(e);
  }
};

exports.updatePlayground = async (req, res, next) => {
  const reqFiles = [];
  if (req.files) {
    const url = "http://" + req.get("host");
    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(url + "/static/images/" + req.files[i].filename);
    }
  }
  const playground = req.file
    ? {
        ...JSON.parse(req.body.playground),
        imgCollection: reqFiles,
      }
    : { ...req.body };
  Playground.findByIdAndUpdate(
    {
      _id: req.params.id,
    },
    {
      ...playground,
      _id: req.params.id,
    }
  )
    .then(() =>
      res.status(200).json({
        message: "Object modifié !",
      })
    )
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

exports.addPlayground = async (req, res, next) => {
  try {
    const reqFiles = [];
    const url = "http://" + req.get("host");
    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(url + "/static/images/" + req.files[i].filename);
    }
    const playground = new Playground({
      ...req.body,
      userID: req.user._id,
      imgCollection: reqFiles,
    });
    await playground.save();
    res.status(200).send(playground);
  } catch (error) {
    next(error);
  }
};

exports.deletePlayground = async (req, res, next) => {
  const playground = await Playground.findOne({ _id: req.params.id });
  const filename = playground.imgCollection;

  for (var i = 0; i < filename.length; i++) {
    // deleting the files works perfectly
    const file = filename[i].slice(36);
    fs.unlink(`public/images/${file}`, async () => {});
  }

  try {
    const playground = await Playground.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Object supprimé",
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

exports.likeOnePlayground = async (req, res, next) => {
  try {
    const findLike = await Playground.find({
      _id: req.params.id,
      likeUser: { $in: [req.user._id] },
    });
    const findUnLike = await Playground.find({
      _id: req.params.id,
      unLikeUser: { $in: [req.user._id] },
    });


    if (findLike.length === 0 && findUnLike.length === 0) {

      const like = await Playground.updateOne(
        { _id: req.params.id },
        { $inc: { like: +1 }, $addToSet: { likeUser: req.user._id } }
      );
      res.status(200).send({ message: "i like this play" });
    } else if (findLike.length > 0) {

      const like = await Playground.updateOne(
        { _id: req.params.id },
        { $inc: { like: -1 }, $pull: { likeUser: req.user._id } }
      );
      res
        .status(200)
        .send({ message: "i already like this play so i dislike" });
    } else if (findUnLike.length > 0) {

      const like = await Playground.updateOne(
        { _id: req.params.id },
        {
          $inc: { like: +1 , unlike: -1},
          $addToSet: { likeUser: req.user._id },
          $pull: { unLikeUser: req.user._id },
        }
      );
      res
        .status(200)
        .send({
          message: "i already unlike this play so i disunlike and like",
        });
    }
  } catch (e) {
    next(e);
  }
};

exports.unLikeOnePlayground = async (req, res, next) => {
  try {
    const findLike = await Playground.find({
      _id: req.params.id,
      likeUser: { $in: [req.user._id] },
    });
    const findUnLike = await Playground.find({
      _id: req.params.id,
      unLikeUser: { $in: [req.user._id] },
    });

    if (findLike.length === 0 && findUnLike.length === 0) {
      const like = await Playground.updateOne(
        { _id: req.params.id },
        { $inc: { unlike: +1 }, $addToSet: { unLikeUser: req.user._id } }
      );
      res.status(200).send({ message: "i like this play" });
    } else if (findUnLike.length > 0) {

      const like = await Playground.updateOne(
        { _id: req.params.id },
        { $inc: { unlike: -1 }, $pull: { unLikeUser: req.user._id } }
      );
      res
        .status(200)
        .send({ message: "i already like this play so i dislike" });
    } else if (findLike.length > 0) {

      const like = await Playground.updateOne(
        { _id: req.params.id },
        { 
          $inc: { like: -1, unlike: +1}, 
          $pull: { likeUser: req.user._id },
          $addToSet: { unLikeUser: req.user._id }
       },
      );
      res
        .status(200)
        .send({
          message: "i already unlike this play so i disunlike and like",
        });
    }
  } catch (e) {
    next(e);
  }
};
