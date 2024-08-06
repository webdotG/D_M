import React, { useState, useEffect } from 'react';
import style from './chatPage.module.scss';
import ChatComponent from '../../components/chat_users/ChatUsers'; // Импортируем компонент ChatComponent

const ChatPage: React.FC = () => {
    const [message, setMessage] = useState(''); 
    const [chats, setChats] = useState([
        { id: '1', name: 'GPT Chat' }, // Обязательный чат с GPT
        { id: '2', name: 'User Test Chat' } // Тестовый пользовательский чат
    ]); 
    const [activeChat, setActiveChat] = useState<{ id: string, name: string }>({ id: '1', name: 'GPT Chat' }); // Активный чат по умолчанию
    const [messages, setMessages] = useState<{ [key: string]: string[] }>({}); // История сообщений для каждого чата
    const [ws, setWs] = useState<WebSocket | null>(null); // Состояние для WebSocket соединения
    const [showChatComponent, setShowChatComponent] = useState(false); // Состояние для показа компонента чата

    // Обработчик отправки сообщения
    const handleSendMessage = () => {
        if (ws && ws.readyState === WebSocket.OPEN && activeChat) {
            const newMessage = { chatId: activeChat.id, message: message };
            ws.send(JSON.stringify(newMessage)); // Отправка сообщения на сервер
            setMessages(prevMessages => ({
                ...prevMessages,
                [activeChat.id]: [...(prevMessages[activeChat.id] || []), message]
            }));
            setMessage(''); // Очистка поля ввода
        } else {
            console.error('WebSocket соединение не открыто');
        }
    };

    // Обработчик изменения текста сообщения
    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    // Обработчик клика на чат
    const handleChatClick = (chat: { id: string, name: string }) => {
        setActiveChat(chat);
        if (ws) {
            ws.close(); // Закрытие предыдущего WebSocket соединения
        }
        const newWs = new WebSocket('wss://example.com/chat/' + chat.id); // Устанавливаем новое WebSocket соединение
        newWs.onopen = () => {
            console.log('WebSocket соединение установлено с ' + chat.name);
            newWs.send(JSON.stringify({ type: 'get_history', chatId: chat.id })); // Запрос истории сообщений
        };
        newWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'history') {
                setMessages(prevMessages => ({
                    ...prevMessages,
                    [chat.id]: data.messages
                }));
            } else if (data.type === 'new_message') {
                setMessages(prevMessages => ({
                    ...prevMessages,
                    [chat.id]: [...(prevMessages[chat.id] || []), data.message]
                }));
            }
            console.log('Новое сообщение от ' + chat.name + ': ' + event.data);
        };
        setWs(newWs);
    };

    // Пример обработки сообщений от сервера (получение списка чатов и обновление состояния)
    useEffect(() => {
        const initialWs = new WebSocket('wss://example.com/chat');
        initialWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'chat_list') {
                setChats(prevChats => [...prevChats, ...data.chats]); // Обновление списка чатов
            }
        };

        setWs(initialWs);

        // Подключение к GPT чату по умолчанию
        handleChatClick({ id: '1', name: 'GPT Chat' });

        return () => {
            if (ws) {
                ws.close(); // Очистка WebSocket соединения при размонтировании компонента
            }
        };
    }, []);

    return (
        <div className={style.container}>
            <h1 className={style.title}>Chat Page</h1>
            <div className={style.chatContent}>
                <div className={style.chatList}>
                    <h2>Чаты:</h2>
                    {/* {chats.length > 0 ? ( */}
                        <div className={style.chatCircleContainer}>
                            {chats.map(chat => (
                                <div key={chat.id} className={style.chatCircle} onClick={() => handleChatClick(chat)}>
                                    <div className={style.chatCircleContent}></div>
                                    <p>{chat.name}</p>
                                </div>
                            ))}
                            <button className={style.button} 
                                onClick={() => setShowChatComponent(true)}>
                                Запросить чат
                            </button>
                        </div>
                     {/* ) : ( */}
                         {/* <p>Нет доступных чатов</p> */}
                     {/* )} */}
                </div>
                <div className={style.chatArea}>
                    {activeChat && (
                        <div>
                            <h3 className={style.activeChatTitle}>ЧАТ С {activeChat.name}</h3>
                            <div className={style.messageHistory}>
                                {messages[activeChat.id]?.map((msg, index) => (
                                    <div key={index} className={style.message}>{msg}</div>
                                ))}
                            </div>
                            <textarea
                                className={style.messageInput}
                                value={message}
                                onChange={handleMessageChange}
                                placeholder="Введите сообщение..."
                            />
                            <button className={style.button} onClick={handleSendMessage}>Отправить сообщение</button>
                        </div>
                    )}
                </div>
            </div>
            
            {showChatComponent && (
                <div className={style.chatComponentContainer}>
                    <ChatComponent />
                    <button className={style.closeButton} onClick={() => setShowChatComponent(false)}>
                        Закрыть
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
