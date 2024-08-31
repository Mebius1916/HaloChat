import { format } from "date-fns"
import { SessionData } from "@/lib/type"
type MessageBox = {
  message: any,
  currentUser: SessionData,
}
const MessageBox = ({ message, currentUser }:MessageBox) => {
  // 如果是当前用户发送的消息，那么就从右向左显示，否则从左向右显示
  return message?.sender?._id !== currentUser._id ? (
    <div className="message-box">
      <img src={message?.sender?.profileImage || "/assets/person.jpg"} alt="profile photo" className="message-profilePhoto" />
      <div className="message-info">
        <p className="text-small-bold">
          {message?.sender?.username} &#160; &#183; &#160; {format(new Date(message?.createdAt), "p")}
        </p>

        {message?.text ? (
          <p className="message-text">{message?.text}</p>
        ) : (
          <img src={message?.photo} alt="message" className="message-photo" />
        )}
      </div>
    </div>
  ) : (
    <div className="message-box justify-end">
      <div className="message-info items-end">
        <p className="text-small-bold">
          {format(new Date(message?.createdAt), "p")}
        </p>

        {message?.text ? (
          <p className="message-text-sender">{message?.text}</p>
        ) : (
          <img src={message?.photo} alt="message" className="message-photo" />
        )}
      </div>
    </div>
  )
}

export default MessageBox