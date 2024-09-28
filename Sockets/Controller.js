const ChatModel = require('../Model/Chat')
const MessageModel = require('../Model/Messages')
const SocketModel = require('../Model/Socket')
const UserModel = require('../Model/user')

module.exports = {
    auth:(socket , next) => {
       const headers = socket?.handshake?.headers?.token;
       socket.userData = { userId:headers}
       next()
       
    },
    GenerateHandshake:async(socket,io)=>{
        let {userId} = socket?.userData
        let FindSocket = await SocketModel.findOne({userId:userId})
        if(FindSocket){
           await SocketModel.updateOne({userId},{socketId:socket?.id,isOnline:true})
        }
        else {
            await SocketModel.create({
                socketId:socket?.id,
                userId:userId,
                isOnline:true
            })   
        }
        io?.to(socket?.id).emit('connection_lisner' , {message:"Connected succefully"})
    },
SendMessage:async(socket,io,data)=>{

  let FindSocket = await SocketModel.findOne({userId:data?.receiverId,isOnline:true})
  let payload = {
    message:{
        text:data?.message,
        link:data?.link,
        media:data?.media,
    },
   
    senderId:socket?.userData?.userId,
    receiverId:data?.receiverId,
  }
  let ChatHeaderPayload = {
    userId:socket?.userData?.userId,
    lastMessage:data?.message||data?.link[0]||data?.media[0],
    receiverId:data?.receiverId
  }

  await ChatModel.create(ChatHeaderPayload)
  await MessageModel.create(payload)

  io?.to(FindSocket?.socketId).emit("receive_message",{data:payload})

},
GetMessages:async(socket,io,data)=>{
    let GetMessages = await MessageModel.find({senderId:data?.senderId,receiverId:socket?.userData?.userId}).populate({path:"senderId",model:UserModel}).populate({path:"receiverId",model:UserModel}).limit(50).exec()
    io?.to(socket?.id).emit("receive_message",{
        data:GetMessages,
        success:true
    })
},
GetChatHeader:async(socket,io)=>{
    let getUsers = await ChatModel.find({userId:socket?.userData?.userId}).populate({path:"receiverId",model:UserModel}).limit(10).exec()
    io?.to(socket?.id).emit("header_list",{
        data:getUsers,success:true
    })

}
}
