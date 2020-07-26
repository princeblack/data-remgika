const GroupNews = require('../models/GroupNews')
const User = require('../models/User')
const createError = require('http-errors');

exports.postGroupNews = async (req, res, next) =>{
    try {
        const reqFiles = [];
        console.log(req.files);
        console.log(req.body);
        console.log(req.body.imgCollection);
        
        
          const url = "http://" + req.get("host");
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
    const allGroups = await GroupNews.find({ groupId: req.params.id }).populate('User')

    res.status(200).send(allGroups)
  } catch (error) {
    next(error)
  }
}
