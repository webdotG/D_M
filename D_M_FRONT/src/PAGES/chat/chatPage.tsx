import React, { useState, useEffect } from 'react';
import style from './chatPage.module.scss';
import { getChats, deleteChat } from '../../API/users_chat';
import CreateChat from './create_chat';

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<{ id: string, name: string, participantName: string | null }[]>([]);
  const [activeChat, setActiveChat] = useState<{ id: string, name: string, participantName: string | null } | null>(null);
  const [showConfirm, setShowConfirm] = useState<{ show: boolean, chatId: string | null }>({ show: false, chatId: null });
  const [loading, setLoading] = useState<boolean>(false);

  const token = localStorage.getItem('token') || '';
  const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

  const fetchChats = async () => {
    setLoading(true);
    try {
      const response = await getChats(token, userId);
      console.log('Полученные чаты:', response);
      if ('message' in response) {
        console.error('Ошибка получения чатов:', response.message);
      } else {
        const formattedChats = response.map((chat: any) => ({
          id: chat.chat_id,
          name: chat.chat_name,
          participantName: chat.invited_user || 'Неизвестно',
        }));
        setChats(formattedChats);
      }
    } catch (error) {
      console.error('Ошибка при получении чатов:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [token, userId]);

  const handleDeleteChat = async () => {
    if (!showConfirm.chatId) return;

    try {
      const response = await deleteChat(token, showConfirm.chatId);
      if ('message' in response) {
        if (response.message.includes('успешно')) {
          console.log('Чат и связанные сообщения успешно удалены');
        } else {
          console.error('Ошибка удаления чата:', response.message);
        }
      } else {
        console.log('Чат и связанные сообщения успешно удалены');
      }
      await fetchChats(); 
      if (activeChat && activeChat.id === showConfirm.chatId) {
        setActiveChat(null);
      }
      setShowConfirm({ show: false, chatId: null }); 
    } catch (error) {
      console.error('Ошибка при удалении чата:', error);
    }
  };

  const handleChatSelect = (chat: { id: string, name: string, participantName: string | null }) => {
    setActiveChat(chat);
  };

  const handleDeleteButtonClick = (chatId: string) => {
    setShowConfirm({ show: true, chatId }); // Показываем модальное окно
  };

  const handleCancelDelete = () => {
    setShowConfirm({ show: false, chatId: null }); // Скрываем модальное окно
  };

  const handleChatCreated = async () => {
    await fetchChats(); 
  };

  return (
    <div className={style.chatPage}>
      <div className={style.chatList}>
        <h2>Список чатов</h2>
        {loading ? <p>Загрузка...</p> : (
          <ul>
            {chats.map(chat => (
              <li key={chat.id}>
                
                <span onClick={() => handleChatSelect(chat)}>
                {chat.id}
                  {chat.name} {chat.participantName ? `с ${chat.participantName}` : 'без собеседника'}
                
                </span>
                <button onClick={() => handleDeleteButtonClick(chat.id)}>Удалить</button>
              </li>
            ))}
          </ul>
        )}
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
