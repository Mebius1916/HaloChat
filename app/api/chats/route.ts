/*
    const createChat = async () => {
      const res = await fetch("/api/chats", {
        method: "POST",
        body: JSON.stringify({
          //当前用户_id
          currentUserId: currentUser._id,
          //选中成员的_id数组
          members: selectedContacts.map((contact:SessionData) => contact._id),
          //是否是群组
          isGroup,
          //群组名称
          name,
        }),
      });
      const chat = await res.json();

      if (res.ok) {
        router.push(`/chats/${chat._id}`);
      }
    };
*/
import { User } from "@/models/User";
import { connectToDB } from "@/mongodb";
import { pusherServer } from "@/lib/pusher";
import { NextRequest} from 'next/server';
import Chat from "@/models/Chat";
import { ObjectId } from "mongoose";
export const POST = async (req:NextRequest) => {
  try {
    await connectToDB();
    const body = await req.json();
    const { currentUserId, members, isGroup, name, groupPhoto } = body;
    
    const query = isGroup
     ? { isGroup, name, groupPhoto, members: [currentUserId,...members] }
      : { members: { $all: [currentUserId,...members], $size: 2 } };
    let chat = await Chat.findOne(query);

    //如果新建群组是合理的
    if (!chat) {
      chat = await new Chat(
        isGroup? query : { members: [currentUserId,...members] }
      );
      await chat.save();
      //将群组_id添加到user模型中的chats[]数组中
      const updateAllMembers = chat.members.map(async (memberId:{_id:ObjectId}) => {
        await User.findByIdAndUpdate(
          memberId,
          {
            $addToSet: { chats: chat._id },
          },
          { new: true }
        );
      });
      // 并发地执行所有更新操作
      Promise.all(updateAllMembers);

      // 为每个成员触发一个实时事件推送，通知他们有新的聊天记录
      chat.members.map(async (member:{_id:ObjectId}) => {
        await pusherServer.trigger(member._id.toString(), "new-chat", chat);
      });
    }

    // 返回聊天记录的 JSON 字符串作为响应，状态码为 200（成功）
    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (err) {
    // 打印错误到控制台，用于调试和记录日志
    console.error(err);
    // 返回一个错误响应，状态码为 500（服务器错误）
    return new Response("Failed to create a new chat", { status: 500 });
  }
};
