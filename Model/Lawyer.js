const mongoose = require('mongoose')

const LawyerSchema = mongoose.Schema({
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
LawyerSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });

const LawyerModel = mongoose.model('lawyers',LawyerSchema)

module.exports = LawyerModel