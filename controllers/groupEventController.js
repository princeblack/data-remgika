const GroupEventSchema = require('../models/GroupsEvents');
const createError = require('http-errors');
const fs = require("fs");

exports.getAllGroupEventSchema = async (req, res, next) => {
  try {
    const events = await GroupEventSchema.find().select("-__v");
    res.status(200).send(events);
  } catch (e) {
    next(e);
  }
  
};
exports.getMyGroupEventSchemas = async (req, res, next) => {
  try {
    const events = await GroupEventSchema.find({ userId: req.user._id }).select("-__v");
    res.status(200).send(events);
  } catch (e) {
    next(e);
  }
};
exports.getOneGroupEventSchema = async (req, res, next) => {
  try {
    const event = await GroupEventSchema.find({groupId: req.params.id}).select('-__v');
    if (!event) throw new createError.NotFound();
    res.status(200).send(event);
  } catch (e) {
    next(e);
  }
};

exports.deleteGroupEventSchema = async (req, res, next) => {
  const events = await GroupEventSchema.findOne({ _id: req.params.id });
  const filename = events.imgCollection;

  for (var i = 0; i < filename.length; i++) {
    // deleting the files works perfectly
    const file = filename[i].slice(36);
    fs.unlink(`public/images/${file}`, async () => {});
  }

  try {
    const event = await GroupEventSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Object supprimé",
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

exports.updateGroupEventSchema = async (req, res, next) => {
   const reqFiles = [];
  //  req.protocol + "://"
   if (req.file) {
     const url = "https://" + req.get("host");
     for (var i = 0; i < req.files.length; i++) {
       reqFiles.push(url + "/static/images/" + req.files[i].filename);
     }
   }   
   const event = req.file
     ? {
         ...JSON.parse(req.body.event),
         imgCollection: reqFiles,
       }
     : { ...req.body };
   GroupEventSchema.findByIdAndUpdate(
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

exports.addGroupEventSchema = async (req, res, next) => {
  try {
    const reqFiles = [];
    const url = "https://" + req.get("host");
    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(url + "/static/images/" + req.files[i].filename);
    }
    const event = new GroupEventSchema({
      ...req.body,
      groupId: req.body.groupId,
      imgCollection: reqFiles,
    });
    await event.save();
    res.status(200).send(event);
  } catch (error) {
    next(error);
  }
};
