import Chat from "@/models/Chat";
import Message from "@/models/Message";
import {User} from "@/models/User";
import { connectToDB } from "@/mongodb/index";
import { NextRequest} from 'next/server';
type ChatParams = {
  params:{
    chatId:string,
  }
}
export const GET = async (req:NextRequest, { params }:ChatParams) => {
  try {
    await connectToDB();

    const { chatId } = params;

    const chat = await Chat.findById(chatId)
      .populate({
        path: "members",
        model: User,
      })
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: User,
        },
      })
      .exec();

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to get chat details", { status: 500 });
  }
};

export const POST = async (req:NextRequest, { params }:ChatParams) => {
  try {
    await connectToDB();

    const { chatId } = params;

    const body = await req.json();

    const { currentUserId } = body;

    await Message.updateMany(
      { chat: chatId },
      //添加并确保只出现一次
      { $addToSet: { seenBy: currentUserId } },
      { new: true }
    )
      .populate({
        path: "sender seenBy",
        model: User,
      })
      .exec();

    return new Response("Seen all messages by current user", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to update seen messages", { status: 500 });
  }
};
