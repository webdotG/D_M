import React, { useState } from 'react';
import { createChat } from '../../API/users_chat'; 
import style from './createChat.module.scss'; 

interface CreateChatProps {
  token: string;
  onChatCreated: () => void; 
}

const CreateChat: React.FC<CreateChatProps> = ({ token, onChatCreated }) => {
  const [chatName, setChatName] = useState('');
  const [invitedUser, setInvitedUser] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Получаем данные пользователя из localStorage
  const user = localStorage.getItem('user');
  const created_user = user ? JSON.parse(user).id : '';

  const handleCreateChat = async () => {
    setError(null);
    try {
      const response = await createChat(created_user, token, chatName, invitedUser);

      if ('message' in response) {
        setError(response.message);
      } else {
        setChatName('');
        setInvitedUser('');
        onChatCreated(); // Обновление списка чатов после создания нового
      }
    } catch (err) {
      setError('Произошла ошибка при создании чата.');
    }
  };

  return (
    <div className={style.createChat}>
      <h3>Создать новый чат</h3>
      <div className={style.inputGroup}>
        <label htmlFor="chatName">Название чата</label>
        <input
          id="chatName"
          type="text"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          placeholder="Введите название чата"
        />
      </div>
      <div className={style.inputGroup}>
        <label htmlFor="invitedUser">Приглашенный пользователь</label>
        <input
          id="invitedUser"
          type="text"
          value={invitedUser}
          onChange={(e) => setInvitedUser(e.target.value)}
          placeholder="Введите ID приглашенного пользователя"
        />
      </div>
      {error && <p className={style.error}>{error}</p>}
      <button onClick={handleCreateChat}>Создать</button>
    </div>
  );
};

export default CreateChat;
