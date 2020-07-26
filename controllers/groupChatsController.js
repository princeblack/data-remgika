const GroupChats = require("../models/chat");
const { models } = require("mongoose");

exports.getGroupChats = async (req, res, next) => {
  try {
    // const pagination = req.query.pagination ? parseInt(req.query.pagination):5;
   const total= await GroupChats.count()
    // const page =req.query.page ? parseInt(req.query.page):1;
    let {skip= 1, limit = 10}= req.query
    skip = Number(skip)
    limit = Number(limit)

    if (limit > total) {
      limit =  total
    }
    let  left = total - ((skip * 1) * limit)
    if (left < 0) {
      left = 0
    }
    console.log(left);
    const chats = await GroupChats.find({ groupId: req.params.id })
      .skip((skip - 1) * limit )
      .limit(limit)
      // .count()
      // .countDocuments()
      .populate({
        path: "userId",
        select: "-password -__v -tokens._id -email -role -updatedAt -createdAt",
      })
      .sort({ _id: -1 });
    res.status(200).send({chats: chats, skip: skip, total: total, left: left});
  } catch (error) {
    next(error);
  }
};
// page > 0 ?
// (page - 1) * pagination 
// ,total, left : total - ((skip * 1) * limit)