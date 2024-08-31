import { pusherServer } from "@/lib/pusher";
import { SessionData } from "@/lib/type";
import Chat from "@/models/Chat";
import Message from "@/models/Message";
import {User} from "@/models/User";
import { connectToDB } from "@/mongodb/index";
import { NextRequest} from 'next/server';
export const POST = async (req:NextRequest) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { chatId, currentUserId, text, photo } = body;

    const currentUser = await User.findById(currentUserId);

    const newMessage = await Message.create({
      chat: chatId,
      //需要拿到头像、用户名等信息
      sender: currentUser,
      text,
      photo,
      // 订阅者为自己？
      seenBy: currentUserId,
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
        $set: { lastMessageAt: newMessage.createdAt },
      },
      { new: true }
    )
      .populate({
        path: "messages",
        model: Message,
        populate: { path: "sender seenBy", model: "User" },
      })
      .populate({
        path: "members",
        model: "User",
      })
      .exec();

      /*这行代码调用了Pusher服务器对象上的trigger方法。
      这个方法的功能是向Pusher服务器发送一个事件newMessage，
      该事件将被推送到所有订阅了与chatId相关的new-message事件的客户端。*/
    await pusherServer.trigger(chatId, "new-message", newMessage)

    /* Triggers a Pusher event for each member of the chat about the chat update with the latest message */
    const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
    updatedChat.members.forEach(async (member:SessionData) => {
      try {
        // 向所有bind->update-chat的客户端推送
        await pusherServer.trigger(member._id.toString(), "update-chat", {
          id: chatId,
          messages: [lastMessage]
        });
      } catch (err) {
        console.error(`Failed to trigger update-chat event`);
      }
    });


    return new Response(JSON.stringify(newMessage), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to create new message", { status: 500 });
  }
};
