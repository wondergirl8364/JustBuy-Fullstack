import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../Styles/ChatApp.css'
import API_BASE_URL from '../config';

const socket = io(API_BASE_URL);
axios.defaults.baseURL = API_BASE_URL;

const ChatApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchUserAndUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Get current user details
        const userRes = await axios.get('/api/users/currentUser', {
            headers: { Authorization: `Bearer ${token}` },
          });
        setCurrentUser(userRes.data);
        // console.log('USER:',userRes.data);

        // Get all other users
        const usersRes = await axios.get('/api/messages/users', {
            headers: { Authorization: `Bearer ${token}` },
        });
          const filteredUsers = usersRes.data.filter((u) => u.User_ID !== userRes.data.User_ID);
        setUsers(filteredUsers);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUserAndUsers();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    socket.on('receive_message', (message) => {
      if (
        (message.sender_id === selectedUser?.User_ID && message.receiver_id === currentUser.User_ID) ||
        (message.sender_id === currentUser.User_ID && message.receiver_id === selectedUser?.User_ID)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [selectedUser, currentUser]);

  const selectUser = async (user) => {
    const token = localStorage.getItem('token');

    setSelectedUser(user);
    const res = await axios.get(`/api/messages/${user.User_ID}?currentUserId=${currentUser.User_ID}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Messages:',res.data)
    setMessages(res.data);
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedUser && currentUser) {
      const messageData = {
        sender_id: currentUser.User_ID,
        receiver_id: selectedUser.User_ID,
        message: newMessage,
      };
      socket.emit('send_message', messageData);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      {/* User List */}
      <div className="user-list">
        <h2 className='msgHead'>Users</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user.User_ID}
              onClick={() => selectUser(user)}
              className={`user-item ${selectedUser?.User_ID === user.User_ID ? 'selected' : ''}`}
            >
              {user.First_Name}
            </li>
          ))}
        </ul>
      </div>
  
      {/* Chat Area */}
      <div className="chat-area">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.message_id || `${msg.sender_id}-${msg.timestamp}`}
              className={`message-container ${msg.sender_id === currentUser?.User_ID ? 'message-right' : 'message-left'}`}
            >
              <div
                className={`message-bubble ${msg.sender_id === currentUser?.User_ID ? 'right' : 'left'}`}
              >
                <p>{msg.message}</p>
                <small>{new Date(msg.timestamp).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
        {
        selectedUser && <div className="message-input-container">
          <textarea
            rows="2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        }
      </div>
    </div>
  );
}  

export default ChatApp;
