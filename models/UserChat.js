const mongosse = require('mongoose')
const {Schema }= mongosse

const userChat = new Schema(
    {
        userId : {
            type: Schema.Types.ObjectId,
            ref : "User"
        },
        message : {
            type: String
        },
        room : {
            type: String
        },
        files:{
            type: Array
        },
        read:{
            type: Boolean,
            default : false
        },
        to :{
            type: Schema.Types.ObjectId,
            ref : "User"
        }

    }
)

module.exports = mongosse.model("User-Chat", userChat);

