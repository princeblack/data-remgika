const Playground = require('../models/Playground');
const createError = require('http-errors');
const fs = require('fs');

exports.getAllPlaygrounds = async (req, res, next) => {
  try {
    const playgrounds = await Playground.find().select('-__v');
    res.status(200).send(playgrounds);
  } catch (e) {
    next(e);
  }
};

exports.getMyPlaygrounds = async (req, res, next) => {
  try {
    const playgrounds = await Playground.find({ userID: req.user._id }).select('-__v');
    res.status(200).send(playgrounds);
  } catch (e) {
    next(e);
  }
};

exports.getOnePlayground = async (req, res, next) => {
  try {
    const playground = await Playground.findById(req.params.id).select('-__v');
    if (!playground) throw new createError.NotFound();
    res.status(200).send(playground);
  } catch (e) {
    next(e);
  }
};

exports.deletePlayground = async (req, res, next) => {
  try {
    const playground = await Playground.findByIdAndDelete(req.params.id);
    if (!playground) throw new createError.NotFound();
    res.status(200).send(playground);
  } catch (e) {
    next(e);
  }
};

exports.updatePlayground = async (req, res, next) => {
  try {
    const playground = await Playground.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    }).select('-__v');
    if (!playground) throw new createError.NotFound();
    res.status(200).send(playground);
  } catch (e) {
    next(e);
  }
};

exports.addPlayground = async (req, res, next) => {
  try {
    const playground = new Playground({
      ...req.body,
      userID: req.user._id,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    await playground.save();
    res.status(200).send(playground);
  } catch (e) {
    next(e);
  }
};
