const mongoose = require('mongoose')

const SocketSchema = mongoose.Schema({
    socketId:{
        type:String
    },
    userId:{
        type:mongoose.Schema.ObjectId
    },
    isOnline:{
        type:Boolean,
        default:false
    },

})
SocketSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });

const SocketModel = mongoose.model('sockets',SocketSchema)
module.exports = SocketModel