const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema =  new Schema({
    writer: {
        type: String
    }, 
    postId: {
        type:String
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    content: {
        type: String
    }

}, { timestamps: true })


module.exports = mongoose.model('Comment', commentSchema);

