const mongoose = require('mongoose')

const MesageSchema = mongoose.Schema({
    message:{
       text:{
        type:String,
       },
       media:{
        type:Array,
       },
       link:{
        type:String
       }
    },
    socketId:{
        type:mongoose.Schema.ObjectId
    },
senderId:{
    type:mongoose.Schema.ObjectId
},
receiverId:{
    type:mongoose.Schema.ObjectId,
}

})
MesageSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });

const MessageModel = mongoose.model('messages',MesageSchema)
module.exports = MessageModel