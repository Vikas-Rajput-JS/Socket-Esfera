const mongoose = require('mongoose')

const ChatSchema = mongoose.Schema({

    userId:{
        type:mongoose.Schema.ObjectId
    },
    receiverId:{
        type:mongoose.Schema.ObjectId

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