const Group = require("../models/Group");
const createError = require("http-errors");
const User = require("../models/User");

exports.getAllGroup = async (req, res, next) => {
  try {
    const groups = await Group.find()
      .populate("userId", "_id")
      .populate("adminUsers")
      .populate("membres", "user");
    res.status(200).send(groups);
  } catch (e) {
    next(e);
  }
};

exports.getGroup = async (req, res, next) => {
  try {
    const groups = await Group.findById(req.params.id);
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
    const groups = await Group.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!groups) throw new createError.NotFound();
    res.status(200).send(groups);
  } catch (e) {
    next(e);
  }
};

exports.addGroup = async (req, res, next) => {
  const reqFiles = [];
  const url = "http://" + req.get("host");
  for (var i = 0; i < req.files.length; i++) {
    reqFiles.push(url + "/static/images/" + req.files[i].filename);
  }  
  const groups = new Group({
    ...req.body,
    userId: req.user._id,
    admin: [
      {
        adminUsers: req.user._id,
      },
    ],
    imgCollection: reqFiles,
  });
  await groups
    .save()
    .then(
      (gb = async () => {
        const user = await User.updateOne(
          { _id: req.user._id },
          { $push: { group: groups._id } }
        );
        res.status(200).send(groups);
      })
    )
    .catch((e) => {
      next(e);
    });
};

exports.joinGroup = async (req, res, next) => {
  const groups = await Group.find({ _id: req.params.id })
    .then(
      (gb = async () => {
        const compare = await User.find({ _id: req.user._id });
        const test = compare[0].group.filter((el) => {
          return el._id == req.params.id;
        });
        if (test[0] === undefined) {
          const user = await User.updateOne(
            { _id: req.user._id },
            { $push: { group: req.params.id } }
          );
          const moorMembers = await Group.updateOne(
            { _id: req.params.id },
            { $inc: { members: +1 } }
          );
          res.status(200).send(user);
        } else {
          res.status(400).send({ message: "you are alredy in this group" });
        }
      })
    )
    .catch((e) => {
      next(e);
    });
};

exports.publicGroups = async (req, res, next) => {
  try {
    const members = await Group.find({ confidentiality: "Public" }).populate('groupId', '_id');
    res.status(200).send(members);
  } catch (error) {
    next(error);
  }
};
exports.getAllMembers = async (req,res,next)=>{
  try {
    const members = await User.find({group: req.params.id})
    res.status(200).send(members);
  } catch (error) {
    next(error)
  }
}
