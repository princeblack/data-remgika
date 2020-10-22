const User = require("../models/User");
const UserChat = require("../models/UserChat");

exports.getMessage = async (req, res, next) => {
  try {
    const messages = await UserChat.find({
      room: { $in: [req.params.id, req.query.id] },
    }).populate("senderUserId");
    res.status(200).send(messages);
  } catch (error) {
    next(error);
  }
};


exports.getAllUserThatIChatWith = async (req, res, next) => {
  try {
    const user = await UserChat.aggregate([
      {
        $match: {
          receiverUserId: req.user._id, // User is in recepients
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$senderUserId", req.user._id] },
              then: "$receiverUserId",
              else: "$senderUserId",
            },
          },
          count: {
            $sum: { $cond: ["$read", 0, 1] },
          },
          createdAt: {
            $first: "$createdAt",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          count: 1,
          createdAt: 1,
          user: 1,
        },
      },
    ]);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};

exports.unread = async (req, res, next) => {
  try {
    const user = await UserChat.aggregate([
      {
        $match: {
          $or: [
            {
              senderUserId: req.user._id,
              receiverUserId: req.params.id,
            },
            {
              senderUserId: req.params.id,
              receiverUserId: req.user._id,
            },
          ],
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderUserId", req.user._id] },
              "$receiverUserId",
              "$senderUserId",
            ],
          },
          count: {
            $sum: { $cond: ["$read", 0, 1] },
          },
          createdAt: {
            $first: "$createdAt",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "details",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          count: 1,
          createdAt: 1,
          details: 1,
          total: 1,
        },
      },
    ]);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};

exports.readMsg = async (req, res, next) => {
  try {
    const message = await UserChat.updateMany(
      {
        senderUserId: req.params.id,
        receiverUserId: req.user._id,
        read: false,
      },
      {
        $set: {
          read: true,
        },
      },
      {
        multi: true,
      }
    );
    res.status(200).send(message);
  } catch (error) {
    next(error);
  }
};


// userId: req.user._id, to:req.params.id

// {
//   $match: {
//     $and: [
//       {
//           $or: [
//               { receiverUserId: req.user._id,}, // User is in recepients
//               { senderUserId: req.user._id, }     // or the sender
//           ],
//       },
//   ]
//   },
// },
// {
//   $sort: {
//     createdAt: -1,
//   },
// },
// {
//   $group: {
//     _id:{
//       receiverUserId: "$receiverUserId" ,
//       senderUserId: "$senderUserId" ,
//     },
//     count: {
//       $sum: 1,
//     },
//     createdAt: {
//       $first: "$createdAt",
//     },
//   },
// },
// {
//   $lookup:{
//       from: "users",
//       localField: "_id.receiverUserId",
//       foreignField: "_id",
//       as:"receiver"
//   }
// },
// {
// $lookup:{
//     from: "users",
//     localField: "_id.senderUserId",
//     foreignField: "_id",
//     as:"sender"
// }
// },
// {
//   $sort: {
//     createdAt: -1,
//   },
// },
// {
//   $project: {
//     _id: 1,
//     count: 1,
//     createdAt: 1,
//     details: {
//       $cond:{if:{$eq: ["$$sender._id",  myId ]} , then:  `${req.user._id}`, else: 'noooo'}
//     },
//     users: 1
//   },
// },

///////////////////////////////////////////////////////////////

// {
//   $project: {
//     sender: {
//       $cond: [{ $eq: ["$receiverUserId", req.user._id] }, true, false],
//     },
//   },
// },
// // { $match:  },
// {
//   $group: {
//     _id: null,
//     count: {
//       $sum: 1,
//     },
//     createdAt: {
//       $first: "$createdAt",
//     },
//   },
// },
// {
//     $lookup:{
//         from: "users",
//         localField: "id",
//         foreignField: "_id",
//         as:"receiver"
//     }
//   },
// { $project: { _id: 1, count: 1 , sender} },

// _id: {
//   $cond: [
//     { $eq: ["$senderUserId", req.user._id] },
//     "$receiverUserId",
//     "$senderUserId",
//   ],
// },
