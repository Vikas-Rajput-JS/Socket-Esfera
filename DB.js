const mongoose = require('mongoose')

mongoose.connect("mongodb://0.0.0.0:27017/Socket-Esfera").then((res)=>{
    console.log("Database is connected successfuly")
})