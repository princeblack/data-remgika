const Rating = require("../models/PlayRating");
const Playground = require("../models/Playground");
const createError = require("http-errors");


exports.addRating = async (req, res, next) => {
  try {
    const rating = new Rating({
      ...req.body,
      userId: req.user._id,
      isVote: true,
    });
    await rating.save();
    const updatePlay = await Playground.updateOne({
    })
    res.status(200).send(rating);
  } catch (error) {
    next(error);
  }
};
