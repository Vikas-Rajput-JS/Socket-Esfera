const ChatModel = require("../Model/Chat");
const ExpertModel = require("../Model/Expert");
const LawyerModel = require("../Model/Lawyer");
const MessageModel = require("../Model/Messages");
const SocketModel = require("../Model/Socket");
const UserModel = require("../Model/user");

module.exports = {
  auth: async (socket, next) => {
    const userID = socket?.handshake?.headers?.token;
    socket.userData = { userId: userID };
    const FindUser = await UserModel.findOne({ _id: userID });
    const FindExpert = await ExpertModel.findOne({ _id: userID });

    const FindLawyer = await LawyerModel.findOne({ _id: userID });
    if (FindExpert || FindLawyer || FindUser) {
      socket.userRole = FindUser?.role || FindLawyer?.role || FindExpert?.role;

      next();
    } else {
      return;
    }
  },
  GenerateHandshake: async (socket, io) => {
    let { userId } = socket?.userData;
    let FindSocket = await SocketModel.findOne({ userId: userId });
    if (FindSocket) {
      await SocketModel.updateOne(
        { userId },
        { socketId: socket?.id, isOnline: true }
      );
    } else {
      await SocketModel.create({
        socketId: socket?.id,
        userId: userId,
        isOnline: true,
      });
    }
    io?.to(socket?.id).emit("connection_listner", {
      message: "Connected succefully",
    });
  },
  SendMessage: async (socket, io, data) => {
    let FindSocket = await SocketModel.findOne({
      userId: data?.receiverId,
      isOnline: true,
    });
    let payload = {
      message: {
        text: data?.message,
        link: data?.link,
        media: data?.media,
      },

      senderId: socket?.userData?.userId,
      senderRole: socket?.userRole,
      receiverRole: data?.receiverRole,
      receiverId: data?.receiverId,
    };
    let ChatHeaderPayload = {
      userId: socket?.userData?.userId,
      userRole: socket?.userRole,
      lastMessage:
        data?.message ||
        (data?.link && data?.link[0]) ||
        (data?.media && data?.media[0]),
      receiverId: data?.receiverId,
      receiverRole: data?.receiverRole,
    };

    await ChatModel.create(ChatHeaderPayload);
    await MessageModel.create(payload);
    if (socket?.userRole == "user") {
      let UserDetails = await UserModel.findOne({
        _id: socket?.userData?.userId,
      }).select("-password");
      payload["senderDetails"] = UserDetails;
    }
    if (socket?.userRole == "lawyer") {
      let UserDetails = await LawyerModel.findOne({
        _id: socket?.userData?.userId,
      }).select("-password");
      payload["senderDetails"] = UserDetails;
    }
    if (socket?.userRole == "expert") {
      let UserDetails = await ExpertModel.findOne({
        _id: socket?.userData?.userId,
      }).select("-password");
      payload["senderDetails"] = UserDetails;
    }

    if (data?.receiverRole == "user") {
      let UserDetails = await UserModel.findOne({
        _id: data?.receiverId,
      }).select("-password");
      payload["receiverDetails"] = UserDetails;
    }
    if (data?.receiverRole == "lawyer") {
      let UserDetails = await LawyerModel.findOne({
        _id: data?.receiverId,
      }).select("-password");
      payload["receiverDetails"] = UserDetails;
    }
    if (data?.receiverRole == "expert") {
      let UserDetails = await ExpertModel.findOne({
        _id: data?.receiverId,
      }).select("-password");
      payload["receiverDetails"] = UserDetails;
    }

    io?.to(FindSocket?.socketId).emit("receive_message", { data: payload });
  },
  GetMessages: async (socket, io, data) => {
    const GetModel = (key) => {
      if (key == "user") {
        return UserModel;
      }
      if (key == "lawyer") {
        return LawyerModel;
      }
      if (key == "expert") {
        return ExpertModel;
      }
    };
    let GetMessages = await MessageModel.find({
      senderId: data?.senderId,
      receiverId: socket?.userData?.userId,
    })
      .populate({
        path: "senderId",
        model: await GetModel(data?.senderRole),
      })
      .populate({
        path: "receiverId",
        model: await GetModel(socket?.userRole),
      })
      .limit(50)
      .exec();
    let GetMessagesReverse = await MessageModel.find({
      senderId: socket?.userData?.userId,
      receiverId: data?.senderId,
    })
      .populate({
        path: "senderId",
        model: await GetModel(socket?.userRole),
      })
      .populate({
        path: "receiverId",
        model: await GetModel(data?.senderRole),
      })
      .limit(50)
      .exec();

    let MsgData = [...GetMessages, ...GetMessagesReverse];
    io?.to(socket?.id).emit("receive_message", {
      data: MsgData,
      success: true,
    });
  },
  GetChatHeader: async (socket, io) => {
    let getUsers = await ChatModel.find({ userId: socket?.userData?.userId })
      .populate({
        path: "receiverId",
        model: UserModel || ExpertModel || LawyerModel,
      })
      .limit(10)
      .exec();
    io?.to(socket?.id).emit("header_list", {
      data: getUsers,
      success: true,
    });
  },
};
