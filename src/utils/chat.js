import { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue, off, push, query, orderByChild, limitToLast, serverTimestamp } from "firebase/database";

function Chat({ userId, secondUserId }) {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

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

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            {message.text} (Sent by: {message.userId === userId ? "You" : "Other user"})
          </li>
        ))}
      </ul>
      <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
