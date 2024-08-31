"use client"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SessionData } from "@/lib/type";
import Loader from "./Loader";
import ChatBox from "./ChatBox";
import { ObjectId } from "mongoose";
import { pusherClient } from "@/lib/pusher";

const ChatList = ({ currentChatId }:{currentChatId:string}) => {
  const { data: sessions } = useSession();
  const currentUser = sessions?.user as SessionData;

  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

  const getChats = async () => {
    try {
      const res = await fetch(
        search !== ""
          ? `/api/users/${currentUser?._id}/searchChat/${search}`
          : `/api/users/${currentUser?._id}`
      );
      const data = await res.json();
      setChats(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getChats();
    }
  }, [currentUser, search]);

  useEffect(() => {
    if (currentUser) {
      //订阅有关自己的更新
      pusherClient.subscribe(currentUser._id);

      const handleChatUpdate = (updatedChat:any) => {
        setChats((allChats:any) =>
          allChats.map((chat:any) => {
            // 匹配当前的聊天_id
            if (chat._id === updatedChat.id) {
              return { ...chat, messages: updatedChat.messages };
            } else {
              return chat;
            }
          })
        );
      };

      const handleNewChat = (newChat:any) => {
        setChats((allChats) => [...allChats, newChat] as any);
      }

      pusherClient.bind("update-chat", handleChatUpdate);
      pusherClient.bind("new-chat", handleNewChat);

      return () => {
        pusherClient.unsubscribe(currentUser._id);
        pusherClient.unbind("update-chat", handleChatUpdate);
        pusherClient.unbind("new-chat", handleNewChat);
      };
    }
  }, [currentUser]);

  return loading ? (
    <Loader />
  ) : (
    <div className="chat-list">
      <input
        placeholder="Search chat..."
        className="input-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="chats">
        {chats?.map((chat, index) => (
          <ChatBox
            chat={chat}
            key={index}
            currentUser={currentUser}
            currentChatId={currentChatId}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
