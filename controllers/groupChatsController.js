const GroupChats = require("../models/chat");
const { models } = require("mongoose");

exports.getGroupChats = async (req, res, next) => {
  try {
    // const pagination = req.query.pagination ? parseInt(req.query.pagination):5;
   const total= await GroupChats.find({ groupId: req.params.id }).countDocuments()
    // const page =req.query.page ? parseInt(req.query.page):1;
    let { skip = 0, limit = 10} = req.query;
    skip = parseInt(skip) || 0;
    limit = parseInt(limit) || 10;
    skip = skip < 0 ? 0 : skip;
    limit = Math.min(50, Math.max(1, limit));
    const chats = await GroupChats.find({ groupId: req.params.id })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "userId",
        select: "-password -__v -tokens._id -email -role -updatedAt -createdAt",
      })
      .sort({ _id: -1 });
    res.status(200).send({chats: chats, meta: {
        total,
        skip,
        limit,
        has_more: total - (skip + limit) > 0,
      }});
      
  } catch (error) {
    next(error);
  }
};
