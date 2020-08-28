const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema =  new Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, 
    reply: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Playground'
    },
    content: {
        type: String
    }

}, { timestamps: true })


module.exports = mongoose.model('Comment', commentSchema);

