const mongoose = require('mongoose')

const ChatSchema = mongoose.Schema({

    userId:{
        type:mongoose.Schema.ObjectId
    },
    userRole:{
type:String
    },
    receiverId:{
        type:mongoose.Schema.ObjectId

    },
    receiverRole:{
        type:String
            },
    lastMessage:{
        type:String
    },

})
ChatSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });

const ChatModel = mongoose.model('chat',ChatSchema)
module.exports = ChatModel