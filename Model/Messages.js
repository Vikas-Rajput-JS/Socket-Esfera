const mongoose = require("mongoose");

const MesageSchema = mongoose.Schema({
  message: {
    text: {
      type: String,
    },
    media: {
      type: Array,
    },
    link: {
      type: String,
    },
  },
  socketId: {
    type: mongoose.Schema.ObjectId,
  },
  senderId: {
    type: mongoose.Schema.ObjectId,
  },
  receiverRole: {
    type: String,
  },
  senderRole: {
    type: String,
  },
  receiverId: {
    type: mongoose.Schema.ObjectId,
  },
  createdAt:{
    type:Date,
    default:new Date
  }
},{
  timestamp:true
});
MesageSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const MessageModel = mongoose.model("messages", MesageSchema);
module.exports = MessageModel;
