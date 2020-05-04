const Playground = require("../models/Playground");
const createError = require("http-errors");
const fs = require("fs");

exports.getAllPlaygrounds = async (req, res, next) => {
  try {
    const playgrounds = await Playground.find().select("-__v");
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
  if (req.file) {
    const url = "https://" + req.get("host");
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
    const url = "https://" + req.get("host");
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
    fs.unlink(`public/images/${file}`,async () => {});
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
