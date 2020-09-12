const Group = require("../models/Group");
const createError = require("http-errors");
const User = require("../models/User");
const { json } = require("express");
const { log } = require("debug");
const fs = require("fs");

exports.getAllGroup = async (req, res, next) => {
  try {
    const groups = await Group.find()
      .populate("userId", "_id")
      .populate("admin.adminUsers");
    res.status(200).send(groups);
  } catch (e) {
    next(e);
  }
};

exports.getGroup = async (req, res, next) => {
  try {
    const groups = await Group.findById(req.params.id)
      .populate("userId", "_id")
      .populate({
        path: "admin",
        select:
          "-password -__v -tokens._id -email -role -updatedAt -createdAt ",
      })
      .populate({
        path: "joindReq",
        select:
          "-password -__v -tokens._id -email -role -updatedAt -createdAt -group ",
      });
    // .select({path: "admin", select: "_id"})
    if (!groups) throw new createError.NotFound();
    res.status(200).send(groups);
  } catch (e) {
    next(e);
  }
};

exports.deleteGroup = async (req, res, next) => {
  try {
    const groups = await Group.findByIdAndDelete(req.params.id);
    if (!groups) throw new createError.NotFound();
    res.status(200).send(groups);
  } catch (e) {
    next(e);
  }
};

exports.updateGroup = async (req, res, next) => {
  try {

    const admin = await Group.find({
      _id: req.params.id,
      admin: { $in: [req.user._id] },
    });
    if (admin.length > 0) {
      const groups = await Group.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
        });
      if (!groups) throw new createError.NotFound();
      // res.status(200).send(groups)
      res.status(200).send({message: "the group is  successfuly update"});
    } else {
      res.status(300).send({message: "Oop! only admin can update group"});
    }
  } catch (e) {
    next(e);
  }
};
exports.updateGroupPicture = async (req, res, next) => {
  try {
    const reqFiles = [];
    if (req.files) {
      const url = "https://" + req.get("host");
      for (var i = 0; i < req.files.length; i++) {
        reqFiles.push(url + "/static/images/" + req.files[i].filename);
      }
    }

    const admin = await Group.find({
      _id: req.params.id,
      admin: { $in: [req.user._id] },
    });
    if (admin.length > 0) {
      const groupFiles = await Group.findOne({ _id: req.params.id });
      const filename = await groupFiles.imgCollection;
      // delete image before update 
      for (var i = 0; i < filename.length; i++) {
        // deleting the files works perfectly
        const file = filename[i].slice(36);    
        fs.unlink(`public/images/${file}`,async () => {});
      }
      const image = req.files
      ? {
          imgCollection: reqFiles,
        }
      : { };

      const groups = await Group.updateOne({_id: req.params.id, },{...image});
      if (!groups) throw new createError.NotFound();
      res.status(200).send({message: "the group is  successfuly update"});
    } else {
      res.status(300).send({message: "Oop! only admin can update group"});
    }
  } catch (e) {
    next(e);
  }
};

exports.addGroup = async (req, res, next) => {
  const reqFiles = [];
  const url = "https://" + req.get("host");
  for (var i = 0; i < req.files.length; i++) {
    reqFiles.push(url + "/static/images/" + req.files[i].filename);
  }
  const groups = new Group({
    ...req.body,
    userId: req.user._id,
    admin: [req.user._id],
    imgCollection: reqFiles,
  });
  await groups
    .save()
    .then(
      (gb = async () => {
        const user = await User.updateOne(
          { _id: req.user._id },
          { $addToSet: { group: groups._id } }
        );
        res.status(200).send(groups);
      })
    )
    .catch((e) => {
      next(e);
    });
};
exports.joinGroupRequest = async (req, res, next) => {
  try {
    const request = await Group.updateOne(
      { _id: req.params.id },
      { $addToSet: { joindReq: req.user._id } }
    );
    res.status(200).send(request);
  } catch (error) {
    next(error);
  }
};
exports.joinGroup = async (req, res, next) => {
  try {
    const user = req.query.user;

    const groups = await Group.find({ _id: req.params.id });
    const groupId = groups[0]._id;
    const checkUser = await User.find({ _id: user, group: { $in: [groupId] } });
    const admin = await Group.find({
      _id: req.params.id,
      admin: { $in: [req.user._id] },
    });
    if (checkUser.length > 0) {
      res.status(300).send({message: "you are alredy in this group"});
    } else {
      if (admin.length > 0) {
        console.log(user);
        const UpdateUser = await User.updateOne(
          { _id: user },
          { $push: { group: req.params.id } }
        );
        const moorMembers = await Group.updateOne(
          { _id: req.params.id },
          { $inc: { members: +1 }, $pull: { joindReq: user }  }
        );
        res.status(200).send({message: "user join the group successfuly"});
      } else {
        res.status(300).send({message: "Oop! only admin can add memebers"});
      }
    }
  } catch (error) {
    next(error);
  }
};
exports.joinGroupRefused = async (req, res, next) => {
  try {
    const user = req.query.user;

    const groups = await Group.find({ _id: req.params.id });
    const groupId = groups[0]._id;
    const checkUser = await User.find({ _id: user, group: { $in: [groupId] } });
    const admin = await Group.find({
      _id: req.params.id,
      admin: { $in: [req.user._id] },
    });
    if (checkUser.length > 0) {
      res.status(300).send({message: "you are alredy in this group"});
    } else {
      if (admin.length > 0) {
        const refused = await Group.updateOne(
          { _id: req.params.id },
          { $pull: { joindReq: user }  }
        );
        res.status(200).send({message: "user join the group successfuly"});
      } else {
        res.status(300).send({message: "Oop! only admin can add memebers"});
      }
    }
  } catch (error) {
    next(error);
  }
};
exports.addAdmin = async (req, res, next) => {
  try {
    const user = req.query.user;
    const addAdminToGroup = await Group.updateOne(
      { _id: req.params.id },
      { $addToSet: { admin: user } }
    );
    res.status(200).send(addAdminToGroup);
  } catch (error) {
    next(error);
  }
};
exports.removeMembers = async (req, res, next) => {
  try {
    const user = req.query.user;
    const group = await Group.find(
      { _id: req.params.id }    
    );
    const numbers = Number(group[0].members)
    if (numbers >= 2) {
      const members = await User.updateOne(
        { _id: user },
        { $pull: { group: req.params.id } }
      );
      const moorMembers = await Group.updateOne(
        { _id: req.params.id },
        { $inc: { members: -1 } }
      );
      res.status(200).send(members);
    } else {
      res.status(406).send({message: "the group should have a user" });
    }

  } catch (error) {
    next(error);
  }
};
exports.removeAdmin = async (req, res, next) => {
  try {
    const user = req.query.user;
    const group = await Group.find(
      { _id: req.params.id }    
    );
    const numbers = Number(group[0].admin.length)
    if (numbers >= 2) {
          const removeAdminToGroup = await Group.updateOne(
      { _id: req.params.id },
      { $pull: { admin: user } }
    );

    res.status(200).send(removeAdminToGroup);
    }else{
      res.status(406).send({message: "the group should have a Admin" });

    }
  
  } catch (error) {
    next(error);
  }
};
exports.publicGroups = async (req, res, next) => {
  try {
    const members = await Group.find().populate(
      "groupId",
      "_id"
    );
    res.status(200).send(members);
  } catch (error) {
    next(error);
  }
};
exports.getAllMembers = async (req, res, next) => {
  try {
    const members = await User.find({ group: req.params.id });
    res.status(200).send(members);
  } catch (error) {
    next(error);
  }
};
