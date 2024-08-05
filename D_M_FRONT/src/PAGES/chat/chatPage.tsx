import React from 'react';
import style from './chatPage.module.scss';
import ChatComponent from '../../components/chat_users/ChatUsers';
import ws from '../../webSocket'; 

const ChatPage: React.FC = () => {
    const handleSendMessage = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send('Hello, this is a test message');
        } else {
            console.error('WebSocket соединение не открыто');
        }
    };

    return (
        <div className={style.container}>
            <h1 className={style.title}>Chat Page</h1>
            <ChatComponent />
            <button className={style.button} onClick={handleSendMessage}>Send Test Message</button>
        </div>
    );
};

export default ChatPage;
