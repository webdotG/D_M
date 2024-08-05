import React, { useState } from 'react';
import style from './chatUsers.module.scss';
import { sendInvitation, confirmConnection } from '../../API/chat_users/chat_users';

const ChatComponent: React.FC = () => {
    const [recipientId, setRecipientId] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleSendInvitation = async () => {
        try {
            const response = await sendInvitation('senderId', recipientId, message);
            console.log(response.data);
            // Отобразить уведомление об отправке приглашения
        } catch (error) {
            console.error(error);
        }
    };

    const handleConfirmConnection = async () => {
        try {
            const response = await confirmConnection('senderId', recipientId);
            console.log(response.data);
            // Логика для подключения по сокету
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={style.container}>
            <input 
                type="text" 
                className={style.input} 
                value={recipientId} 
                onChange={(e) => setRecipientId(e.target.value)} 
                placeholder="Recipient ID" 
            />
            <textarea 
                className={style.textarea} 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Message"
            ></textarea>
            <button className={style.button} onClick={handleSendInvitation}>Send Invitation</button>
            <button className={style.button} onClick={handleConfirmConnection}>Confirm Connection</button>
        </div>
    );
};

export default ChatComponent;
