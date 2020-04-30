const ProfileImage = require("../models/ProfileImage");
const createError = require("http-errors");
const fs = require("fs");

exports.getAllProfileImage = async (req, res, next) => {
  try {
    const profileImages = await ProfileImage.find().select("-__v");
    res.status(200).send(profileImages);
  } catch (e) {
    next(e);
  }
};

exports.getMyProfileImage = async (req, res, next) => {
  try {
    const profileImages = await ProfileImage.find({
      userID: req.user._id,
    }).select("-__v");
    res.status(200).send(profileImages);
  } catch (e) {
    next(e);
  }
};

exports.getOneProfileImage = async (req, res, next) => {
  try {
    const profileImages = await ProfileImage.findById(req.params.id).select(
      "-__v"
    );
    if (!profileImages) throw new createError.NotFound();
    res.status(200).send(profileImages);
  } catch (e) {
    next(e);
  }
};

exports.updateProfileImage = async (req, res, next) => {
  try {
    const profileImages = await ProfileImage.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    ).select("-__v");
    if (!profileImages) throw new createError.NotFound();
    res.status(200).send(profileImages);
  } catch (e) {
    next(e);
  }
};

exports.addProfileImage = async (req, res, next) => {
  try {
    const reqFiles = [];
    const url = req.protocol + "://" + req.get("host");
    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(url + "/static/images/" + req.files[i].filename);
    }
    const profileImages = new ProfileImage({
      userID: req.user._id,
      imgCollection: reqFiles,
    });
    await profileImages.save();
    res.status(200).send(profileImages);
  } catch (error) {
    next(error);
  }
};
exports.deleteProfileImage = async (req, res, next) => {
  ProfileImage.findOne({ _id: req.params.id })
    .then((profileImages) => {
      const filename = profileImages.imgCollection;
      fs.unlink(`public/images/${filename.join().slice(36)}`, async () => {
        const profileImages = await ProfileImage.findByIdAndDelete(
          req.params.id
        )
          .then(() =>
            res.status(200).json({
              message: "Object supprimé",
            })
          )
          .catch((error) =>
            res.status(400).json({
              error,
            })
          );
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
