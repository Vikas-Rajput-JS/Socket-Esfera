const mongoose = require('mongoose')

const ExpertSchema = mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    fullName:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    role:{
        type:String
    }
})
ExpertSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });

const ExpertModel = mongoose.model('experts',ExpertSchema)

module.exports = ExpertModel