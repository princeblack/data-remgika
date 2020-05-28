const mongoose = require('mongoose');
const { Schema } = mongoose;

const dislikeSchema =  new Schema({
   userId: {
       type: Schema.Types.ObjectId,
       ref: 'User'
   },
   commentId: {
       type: Schema.Types.ObjectId,
       ref: 'Comment'
   },
   playId: {
       type: Schema.Types.ObjectId,
       ref: 'Playground'
   }

}, { timestamps: true })


module.exports = mongoose.model('Dislike', dislikeSchema);

