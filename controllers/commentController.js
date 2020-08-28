const Event = require("../models/Event");
const Comment = require("../models/Comment");
const createError = require("http-errors");

exports.addComment = async (req, res, next) => {
  try {   
    const comment = new Comment({
      ...req.body,
      writer: req.user._id
    });
    await comment.save()
    res.status(200).send(comment);
  } catch (error) {
    next(error);
  }
};

exports.getComment= async (req, res, next)=>{
  try {
    const comment = await Comment.find({postId: req.params.id})
    .populate({
      path: "writer",
      select:
        "-password -__v -tokens._id -email -role -updatedAt -createdAt -eventLike -group -groupLike -like",
    })
    .sort("-createdAt").select(
      "-__v"
    );    
    res.status(200).send(comment);
  } catch (e) {
    next(e);
  }
}
exports.deleteComment= async (req, res, next)=>{
  try {
    const comment = await Comment.findByIdAndDelete({_id: req.params.id})
    res.status(200).send({ message: "Object supprimé"});
  } catch (e) {
    next(e);
  }
}


// { postId: req.params.id }
// const comment = await Comment.findOne({ "postId":req.params.id})
// if (!comment) throw new createError.NotFound();
// res.status(200).send(comment);