import React, { useState, useContext, useEffect } from 'react';
import "./Message.css";
import { AuthContext } from '../../../../context/Auth';
import { projectFirestore } from "../../../../firebase/config";
import firebase from 'firebase/app';


const Message = ({ recipientName, activityId, closeModal, visible }) => {
  const { currentUser } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const messagesRef = projectFirestore
        .collection("Activities")
        .doc(activityId)
        .collection("Messages");
  
      const snapshot = await messagesRef
        .orderBy("timestamp", "asc")
        .get();
  
      const fetchedMessages = snapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .filter(
          msg =>
            (msg.senderId === currentUser.uid && msg.recipientName === recipientName) ||
            (msg.senderId !== currentUser.uid && msg.senderName === recipientName)
        );
  
      setMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching messages: ", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [recipientName]);

  const sendMessageToFirestore = async () => {
    if (!message.trim()) return;
    
    try {
      const messageRef = projectFirestore.collection("Activities").doc(activityId).collection("Messages");
      const newMessage = {
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        recipientName: recipientName,
        content: message,
        timestamp: new Date()
      };
      const docRef = await messageRef.add(newMessage);
      setMessages([...messages, { ...newMessage, id: docRef.id }]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div className={`modal-background${visible ? ' visible' : ''}`}>
    <div className="message">
      <button className="close-button" onClick={closeModal}>&times;</button>
      <h2>Send a message to {recipientName}</h2>
      <div className="message-list">
        {messages.map(msg => (
          <div key={msg.id} className={`message-item ${msg.senderId === currentUser.uid ? "sent" : "received"}`}>
            <div className="message-sender">{msg.senderName}</div>
            <div className="message-content">{msg.content}</div>
            <div className="message-timestamp">{new Date(msg.timestamp instanceof firebase.firestore.Timestamp ? msg.timestamp.toDate() : msg.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <textarea
        className="message-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message here..."
      />
      <button className="send-button" onClick={sendMessageToFirestore}>
        <i className="material-icons">send</i>
        Send
      </button>
    </div>
    </div>
  );
};

export default Message;
