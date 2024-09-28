const http = require('http')
require('./DB')
const app = require('express')()
const  Server = http.createServer(app)
require('./Sockets/index')(Server)
Server.listen(3000,()=>{
    console.log('Server is listening on Port 3000')
})