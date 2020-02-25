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
    const event = new Event(req.body);
    await event.save();
    res.status(200).send(event);
  } catch (e) {
    next(e);
  }
};
