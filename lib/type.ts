import mongoose from "mongoose";
export interface SessionData {
  _id: string;
  username: string,
  email: string,
  password: string,
  profileImage?: string,
  chats?: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
}

export interface messageData{
  chat: string,
  sender: SessionData,
  text:string
  photo:string
  // 订阅者为自己？
  seenBy: SessionData[],
}