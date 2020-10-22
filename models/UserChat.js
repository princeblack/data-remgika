const mongosse = require('mongoose');
const { array } = require('../middleware/multer-config');
const {Schema }= mongosse

const userChat = new Schema(
    {
        senderUserId : {
            type: Schema.Types.ObjectId,
            ref : "User"
        },
        message : {
            type: String
        },
        room : {
            type: Array
        },
        files:{
            type: Array
        },
        read:{
            type: Boolean,
            default : false
        },
        receiverUserId :{
            type: Schema.Types.ObjectId,
            ref : "User"
        }

    },{
        timestamps: true
    }
)
userChat.index(
    {senderUserId: 1}
    )
userChat.index({
    receiverUserId: 1
  })
module.exports = mongosse.model("User-Chat", userChat);

