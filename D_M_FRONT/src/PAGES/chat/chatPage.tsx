import React, { useState, useEffect } from 'react';
import style from './chatPage.module.scss';
import { getChats, deleteChat } from '../../API/users_chat';
import CreateChat from './create_chat';

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<{ id: string, name: string }[]>([]);
  const [activeChat, setActiveChat] = useState<{ id: string, name: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState<{ show: boolean, chatId: string | null }>({ show: false, chatId: null });

  const token = localStorage.getItem('token') || '';
  const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

  useEffect(() => {
    const fetchChats = async () => {
      const response = await getChats(token, userId);
      if ('message' in response) {
        console.error(response.message);
      } else {
        const formattedChats = response.map((chat: any) => ({
          id: chat.chat_id,
          name: chat.chat_name,
        }));
        setChats(formattedChats);
      }
    };

    fetchChats();
  }, [token, userId]);

  const handleDeleteChat = async () => {
    if (!showConfirm.chatId) return;

    const response = await deleteChat(token, showConfirm.chatId);
    if ('message' in response) {
      console.error(response.message);
    } else {
      const updatedChats = await getChats(token, userId);
      if ('message' in updatedChats) {
        console.error(updatedChats.message);
      } else {
        const formattedChats = updatedChats.map((chat: any) => ({
          id: chat.chat_id,
          name: chat.chat_name,
        }));
        setChats(formattedChats);
        if (activeChat && activeChat.id === showConfirm.chatId) {
          setActiveChat(null);
        }
        setShowConfirm({ show: false, chatId: null }); // Скрываем модальное окно
      }
    }
  };

  const handleChatSelect = (chat: { id: string, name: string }) => {
    setActiveChat(chat);
  };

  const handleDeleteButtonClick = (chatId: string) => {
    setShowConfirm({ show: true, chatId }); // Показываем модальное окно
  };

  const handleCancelDelete = () => {
    setShowConfirm({ show: false, chatId: null }); // Скрываем модальное окно
  };

  const handleChatCreated = () => {
    // Логика для обновления списка чатов после создания нового
  };

  return (
    <div className={style.chatPage}>
      <div className={style.chatList}>
        <h2>Список чатов</h2>
        <ul>
          {chats.map(chat => (
            <li key={chat.id}>
              <span onClick={() => handleChatSelect(chat)}>{chat.name}</span>
              <button onClick={() => handleDeleteButtonClick(chat.id)}>Удалить</button>
            </li>
          ))}
        </ul>
        <CreateChat token={token} onChatCreated={handleChatCreated} />
      </div>

      {showConfirm.show && (
        <div className={style.confirmModal}>
          <div className={style.confirmModalContent}>
            <p>Вы уверены, что хотите удалить этот чат?</p>
            <button onClick={handleDeleteChat}>Да</button>
            <button onClick={handleCancelDelete}>Нет</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
