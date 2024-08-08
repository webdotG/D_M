import React, { useState, useEffect } from 'react';
import style from './chatPage.module.scss';
import { createWebSocketConnection, handleWebSocketMessage } from '../../webSocket';
import { createChat, getChats, getMessages, sendMessage, deleteChat } from '../../API/users_chat';

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<{ id: string, name: string }[]>([]);
  const [activeChat, setActiveChat] = useState<{ id: string, name: string } | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: { senderId: string, text: string }[] }>({});
  const [newChatName, setNewChatName] = useState('');
  const [invitedUser, setInvitedUser] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  const token = localStorage.getItem('token') || '';
  const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (error) {
        console.error('Ошибка обработки сообщения:', error);
      }
    };

    const initialWs = createWebSocketConnection(import.meta.env.VITE_WS_URL || 'ws://localhost:2525', handleMessage);
    setWs(initialWs);

    return () => {
      if (initialWs) {
        initialWs.close();
      }
    };
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      const response = await getChats(token, userId);
      if ('message' in response) {
        console.error(response.message);
      } else {
        setChats(response);
      }
    };

    fetchChats();
  }, [token, userId]);

  useEffect(() => {
    if (activeChat) {
      const fetchMessages = async () => {
        const response = await getMessages(token, activeChat.id);
        if ('message' in response) {
          console.error(response.message);
        } else {
          setMessages(prevMessages => ({
            ...prevMessages,
            [activeChat.id]: response
          }));
        }
      };

      fetchMessages();
    }
  }, [activeChat, token]);

  const handleSendMessage = async () => {
    if (activeChat && userId) {
      const response = await sendMessage(token, activeChat.id, message);
      if ('message' in response) {
        console.error(response.message);
      } else {
        setMessages(prevMessages => ({
          ...prevMessages,
          [activeChat.id]: [...(prevMessages[activeChat.id] || []), { senderId: userId, text: message }]
        }));
        setMessage('');
      }
    }
  };

  const handleChatSelect = (chat: { id: string, name: string }) => {
    setActiveChat(chat);
  };

  const handleCreateChat = async () => {
    if (newChatName && invitedUser) {
      const response = await createChat(token, newChatName, invitedUser);
      if ('message' in response) {
        console.error(response.message);
      } else {
        setNewChatName('');
        setInvitedUser('');
        const updatedChats = await getChats(token, userId);
        if ('message' in updatedChats) {
          console.error(updatedChats.message);
        } else {
          setChats(updatedChats);
        }
      }
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    const response = await deleteChat(token, chatId);
    if ('message' in response) {
      console.error(response.message);
    } else {
      const updatedChats = await getChats(token, userId);
      if ('message' in updatedChats) {
        console.error(updatedChats.message);
      } else {
        setChats(updatedChats);
        if (activeChat && activeChat.id === chatId) {
          setActiveChat(null);
        }
      }
    }
  };

  return (
    <div className={style.chatPage}>
      <div className={style.chatList}>
        <h2>Список чатов</h2>
        <ul>
          {chats.map(chat => (
            <li key={chat.id}>
              <span onClick={() => handleChatSelect(chat)}>{chat.name}</span>
              <button onClick={() => handleDeleteChat(chat.id)}>Удалить</button>
            </li>
          ))}
        </ul>
        <div className={style.newChat}>
          <h3>Создать новый чат</h3>
          <input
            type="text"
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            placeholder="Название чата"
          />
          <input
            type="text"
            value={invitedUser}
            onChange={(e) => setInvitedUser(e.target.value)}
            placeholder="Приглашенный пользователь"
          />
          <button onClick={handleCreateChat}>Создать</button>
        </div>
      </div>
      {activeChat && (
        <div className={style.chatWindow}>
          <h2>Чат: {activeChat.name}</h2>
          <div className={style.messages}>
            {messages[activeChat.id] && messages[activeChat.id].map((msg, index) => (
              <div key={index}>{msg.text}</div>
            ))}
          </div>
          <div className={style.inputArea}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введите сообщение"
            />
            <button onClick={handleSendMessage}>Отправить</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
