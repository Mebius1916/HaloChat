"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { SessionData } from "@/lib/type";
const Contacts = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<SessionData[]>([]);
  const [search, setSearch] = useState("");

  const { data: session } = useSession();
  const currentUser = session?.user as SessionData;

  //获取到全部用户数据
  const getContacts = async () => {
    try {
      const res = await fetch(
        //不查询的时候显示所有用户，查询的时候只显示查询的用户
        search !== "" ? `/api/users/searchContact/${search}` : "/api/users"
      );
      const data = await res.json();  
      //在所有信息里剔除自己的信息
      setContacts(data.filter((contact:SessionData) => contact._id !== currentUser._id));
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser) getContacts();
  }, [currentUser, search]);

  /* SELECT CONTACT */
  const [selectedContacts, setSelectedContacts] = useState([]);

  //响应式的值
  const isGroup = selectedContacts.length > 1;
  const handleSelect = (current: never) => {
    //取消选中
    if (selectedContacts.includes(current)) {
      setSelectedContacts((prevSelectedContacts) =>
        prevSelectedContacts.filter((item) => item !== current)
      );
    } else {
      //选中
      setSelectedContacts((Contacts) => [
        ...Contacts,//之前所选
        current,//当前所选
      ]);
    }
  };

  /* ADD GROUP CHAT NAME */
  const [name, setName] = useState("");

  const router = useRouter();

  /* CREATE CHAT */
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

  return loading ? (
    <Loader />
  ) : (
    // center search
    <div className="create-chat-container">
      <input
        placeholder="Search contact..."
        className="input-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/*center  list */}
      <div className="contact-bar">
        <div className="contact-list">
          <p className="text-body-bold">Select or Deselect</p>
          <div className="flex flex-col flex-1 gap-5 
          overflow-y-scroll custom-scrollbar">
            {contacts.map((current:SessionData, index) => (
              <div
                key={index}
                className="contact"
                onClick={() => handleSelect(current as never)}
              >
                {selectedContacts.find((item) => item === current) ? (
                  <CheckCircle sx={{ color: "red" }} />
                ) : (
                  <RadioButtonUnchecked />
                )}
                <img
                  src={current.profileImage || "/assets/person.jpg"}
                  alt="profile"
                  className="profilePhoto"
                />
                <p className="text-base-bold">{current.username}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="create-chat">
          {isGroup && (
            <>
              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Group Chat Name</p>
                <input
                  placeholder="Enter group chat name..."
                  className="input-group-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-body-bold">Members</p>
                <div className="flex flex-wrap gap-3">
                  {selectedContacts.map((contact:SessionData, index) => (
                    <p className="selected-contact" key={index}>
                      {contact.username}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
          <button
            className="btn"
            onClick={createChat}
            disabled={selectedContacts.length === 0}
          >
            FIND OR START A NEW CHAT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
