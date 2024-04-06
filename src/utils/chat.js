import { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue, off, push, query, orderByChild, limitToLast, serverTimestamp } from "firebase/database";
import "../css/chat.css";
import getUserData from "./getUserData";

function Chat({ userId, secondUserId }) {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [secondUserData, setSecondUserData] = useState();
  
  useEffect(() => {
    let messagesRef;
    if (userId && secondUserId) {
      const userPath = userId < secondUserId ? `${userId}_${secondUserId}` : `${secondUserId}_${userId}`;
      messagesRef = ref(database, `messages/${userPath}`);
      const messagesQuery = query(messagesRef, orderByChild("timestamp"), limitToLast(20));

      const handleNewMessage = (snapshot) => {
        const messagesData = snapshot.val();
        if (messagesData) {
          const messagesList = Object.values(messagesData);
          setMessages(messagesList);
        } else {
          setMessages([]);
        }
      };
      onValue(messagesQuery, handleNewMessage);

      return () => {
        off(messagesQuery, handleNewMessage);
      };
    }
  }, [userId, secondUserId]);

  // Convert secondUserUID to name
  useEffect(() => {
    const fetchSecondUserData = async () => {
      if (secondUserId) {
        const userData = await getUserData(secondUserId);
        setSecondUserData(userData);
      }
    };

    fetchSecondUserData();
  }, [secondUserId]);

  const sendMessage = () => {
    if (messageText.trim() !== "") {
      if (userId && secondUserId) {
        const userPath = userId < secondUserId ? `${userId}_${secondUserId}` : `${secondUserId}_${userId}`;
        const messagesRef = ref(database, `messages/${userPath}`);
        push(messagesRef, {
          text: messageText,
          userId: userId,
          timestamp: serverTimestamp(),
        });
        setMessageText("");
      }
    }
  };
  // If view own profile, hide the chat component
  if (!userId || !secondUserId) {
    return null;
  }
  console.log(secondUserData)
  return (
    <div>
      {/* Floating chat button */}
      {!showChat && (
        <div className="chat-float" onClick={() => setShowChat(true)}>
          Chat
        </div>
      )}
      {/* Chat window */}
      {showChat && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-close" onClick={() => setShowChat(false)}>
              ×
            </div>
            Chat with {secondUserData.name}
          </div>
          <div className="chat-body">
            <ul>
              {messages.map((message, index) => (
                <li key={index}>
                  {message.text} (Sent by: {message.userId === userId ? "You" : "Other user"})
                </li>
              ))}
            </ul>
          </div>
          <div className="chat-footer">
            <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
