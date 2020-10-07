const UserChat = require('../models/UserChat') ;


exports.getMessage = async (req, res, next) =>{
    try {
        const messages = await UserChat.find({userId: req.params.id && req.user._id , to: req.user._id && req.params.id }).populate('userId')
        res.status(200).send(messages)
    } catch (error) {
        next(error)
    }
}

// exports.getPeopleMsg = async (req, res, next) =>{
//     try {
//         const messages = await UserChat
//     } catch (error) {
//         next(error)
//     }
// }

exports.unread = async (req, res, next)=>{
    try {
        const users = await UserChat.find({userId: req.params.id, to : req.user._id, read: false})
        res.status(200).send(users)
    } catch (error) {
        next(error)
    }
}

// userId: req.user._id, to:req.params.id