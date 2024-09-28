const SocketClient = require('socket.io')
const Controller = require('./Controller')
module.exports = async(server)=>{
    const io = SocketClient(server,{origin:"*"});
    io.use(Controller.auth)
    io.on("connection",(Socket)=>{
        (async() => {
            Controller.GenerateHandshake(Socket,io)
        })();
        Socket.on('send_message',async(data)=>Controller.SendMessage(Socket,io,data));
        Socket.on("retrieve_message",async(data)=>Controller.GetMessages(Socket,io,data));
        Socket.on("chat_header",async(data)=>Controller.GetChatHeader(Socket,io,data))
    })

}