import Chat from "@/models/Chat";
import Message from "@/models/Message";
import {User} from "@/models/User";
import { connectToDB } from "@/mongodb/index";
import { NextRequest} from 'next/server';
type ChatParams = {
  params:{
    useId:string,
    quary:string
  }
}
export const GET = async (req:NextRequest, { params }:ChatParams) => {
  try {
    await connectToDB();
    const { useId, quary } = params;
    // console.log(params);
    //在所有Chat模型中搜所存在 自己的id && 搜索的字符
    const searchedChat = await Chat.find({
      members: useId,//自己的id
      name: { $regex: quary, $options: "i" },//名字匹配
    })
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

    return new Response(JSON.stringify(searchedChat), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to search chat", { status: 500 });
  }
};
