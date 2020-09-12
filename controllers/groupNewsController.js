const GroupNews = require('../models/GroupNews')
const User = require('../models/User')
const createError = require('http-errors');
const fs = require('fs')
exports.postGroupNews = async (req, res, next) =>{
    try {
        const reqFiles = []; 
          const url = "https://" + req.get("host");
          for (var i = 0; i < req.files.length; i++) {
            reqFiles.push(url + "/static/images/" + req.files[i].filename);
          }
        const groupNews = await GroupNews({
            ...req.body,
            userId: req.user._id,
            groupId: req.body.groupId,
            imgCollection: reqFiles,
        })
        await groupNews.save();
        res.status(200).send(groupNews);
    } catch (error) {
        next(error)
    }
}

exports.getAllGRoupNews = async (req, res, next)=>{
  try {
    const allGroups = await GroupNews.find({ groupId: req.params.id })
    .populate({
      path: "userId",
      select:
        "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
    })
    .sort({ _id: -1 });

    res.status(200).send(allGroups)
  } catch (error) {
    next(error)
  }
}

exports.deleteGroupNews= async (req, res, next) => {
  const newsFile = await GroupNews.findOne({ _id: req.params.id });
  const filename = newsFile.imgCollection;

  for (var i = 0; i < filename.length; i++) {
    // deleting the files works perfectly
    const file = filename[i].slice(36);    
    fs.unlink(`public/images/${file}`,async () => {});
  }

  try {
    const news = await GroupNews.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Object supprimé",
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};