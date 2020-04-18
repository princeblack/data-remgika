const Event = require('../models/Event');
const createError = require('http-errors');

exports.getAllEvent = async (req, res, next) => {
  try {
    const events = await Event.find().select('-__v');
    res.status(200).send(events);
  } catch (e) {
    next(e);
  }
};

exports.getOneEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).select('-__v');
    if (!event) throw new createError.NotFound();
    res.status(200).send(event);
  } catch (e) {
    next(e);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) throw new createError.NotFound();
    res.status(200).send(event);
  } catch (e) {
    next(e);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    }).select('-__v');
    if (!Event) throw new createError.NotFound();
    res.status(200).send(event);
  } catch (e) {
    next(e);
  }
};

exports.addEvent = async (req, res, next) => {
  try {
    const reqFiles = [];
    const url = req.protocol + "://" + req.get("host");
    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(url + "/static/images/" + req.files[i].filename);
    }
    const event = new Event({
      ...req.body,
      userId: req.user._id,
      imgCollection: reqFiles,
    });
    await event.save();
    res.status(200).send(event);
  } catch (error) {
    next(error);
  }
};
