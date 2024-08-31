import Chat from "@/models/Chat";
import Message from "@/models/Message";
import {User} from "@/models/User";
import { connectToDB } from "@/mongodb/index";
import { NextRequest, NextResponse } from 'next/server';
  type Params = {
    params:{
      userId:string,
    }
  }

  export const GET = async (req:NextRequest, { params }:Params) => {
  try {
    await connectToDB();

    const { userId } = params;

    const allChats = await Chat.find({ members: userId })
      .sort({ lastMessageAt: -1 })
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

    return new Response(JSON.stringify(allChats), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to get all chats of current user", {
      status: 500,
    });
  }
};
