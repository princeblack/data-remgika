const mongoose = require("mongoose");
const { Schema } = mongoose;

// Declare the Schema of the Mongo model
const playRating = new Schema({
    userId:{
        type:String,
        required:true,
        unique:true,
    },
    playId:{
        type:String,
        required:true,
        unique:true,
    },
    link:{
        type:Number,
        required:true,
        enum: ["0", "1"],
    },
    unlink:{
        type:Number,
        required:true,
        enum: ["0", "1"],
    },
    isVote:{
        type: Boolean,
        required: true
    }
});

//Export the model
module.exports = mongoose.model('Rating', playRating);
