const Event = require('../models/Event');
const createError = require('http-errors');
const fs = require("fs");

exports.getAllEvent = async (req, res, next) => {
  try {
    const events = await Event.find().select("-__v");
    res.status(200).send(events);
  } catch (e) {
    next(e);
  }
  
};
exports.getMyEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ userId: req.user._id }).select("-__v");
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
  const events = await Event.findOne({ _id: req.params.id });
  const filename = events.imgCollection;

  for (var i = 0; i < filename.length; i++) {
    // deleting the files works perfectly
    const file = filename[i].slice(36);
    fs.unlink(`public/images/${file}`, async () => {});
  }

  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Object supprimé",
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

exports.updateEvent = async (req, res, next) => {
   const reqFiles = [];
   if (req.file) {
     const url = req.protocol + "://" + req.get("host");
     for (var i = 0; i < req.files.length; i++) {
       reqFiles.push(url + "/static/images/" + req.files[i].filename);
     }
   }
   console.log(req.body);
   
   const event = req.file
     ? {
         ...JSON.parse(req.body.event),
         imgCollection: reqFiles,
       }
     : { ...req.body };
   Event.findByIdAndUpdate(
     {
       _id: req.params.id,
     },
     {
       ...event,
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
