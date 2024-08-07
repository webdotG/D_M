import WebSocket, { WebSocketServer } from 'ws';  
import { pool } from './db.js';

const createWsServer = (httpServer) => {
    const wss = new WebSocketServer({ server: httpServer });
    const activeConnections = new Map();
    const inactivityTimeout = 30000; // 30 секунд для проверки активности

    const checkInactivity = () => {
        const now = Date.now();
        activeConnections.forEach((lastActiveTime, ws) => {
            if (now - lastActiveTime > inactivityTimeout) {
                console.log('Закрытие неактивного соединения');
                ws.close();
                activeConnections.delete(ws);
            }
        });
    };

    setInterval(checkInactivity, inactivityTimeout);

    wss.on('connection', (ws) => {
        console.log('WebSocket клиент подключен');
        activeConnections.set(ws, Date.now());

        ws.on('message', async (message) => {
            console.log('Получено сообщение:', message);

            let parsedMessage;
            try {
                parsedMessage = JSON.parse(message);
                console.log('Парсинг сообщения успешен:', parsedMessage);
            } catch (error) {
                console.error('Ошибка при парсинге сообщения:', error);
                ws.send(JSON.stringify({ type: 'error', message: 'Некорректное сообщение' }));
                return;
            }

            const { type, payload } = parsedMessage;
            activeConnections.set(ws, Date.now()); // Обновляем время последней активности

            switch (type) {
                case 'chat_request':
                    console.log('Запрос на создание чата:', payload);
                    const { user1, user2 } = payload;
                    try {
                        const chatId = await createChat(user1, user2);
                        console.log('Чат создан с ID:', chatId);
                        ws.send(JSON.stringify({ type: 'chat_created', chatId }));
                    } catch (err) {
                        console.error('Ошибка при создании чата:', err);
                        ws.send(JSON.stringify({ type: 'error', message: 'Ошибка при создании чата' }));
                    }
                    break;

                case 'new_message':
                    console.log('Новое сообщение:', payload);
                    const { chatId: chatIdForMessage, senderId, text } = payload;
                    try {
                        await saveMessage(chatIdForMessage, senderId, text);
                        console.log('Сообщение сохранено для чата ID:', chatIdForMessage);
                        broadcastMessage(wss, chatIdForMessage, { senderId, text });
                    } catch (err) {
                        console.error('Ошибка при сохранении сообщения:', err);
                        ws.send(JSON.stringify({ type: 'error', message: 'Ошибка при сохранении сообщения' }));
                    }
                    break;

                case 'get_history':
                    console.log('Запрос на получение истории сообщений для чата ID:', payload.chatId);
                    try {
                        const messages = await getChatHistory(payload.chatId);
                        console.log('История сообщений получена:', messages);
                        ws.send(JSON.stringify({ type: 'chat_history', chatId: payload.chatId, messages }));
                    } catch (err) {
                        console.error('Ошибка при получении истории сообщений:', err);
                        ws.send(JSON.stringify({ type: 'error', message: 'Ошибка при получении истории сообщений' }));
                    }
                    break;

                case 'get_chat_list':
                    console.log('Запрос на получение списка чатов');
                    try {
                        const chats = await getChats();
                        console.log('Список чатов получен:', chats);
                        ws.send(JSON.stringify({ type: 'chat_list', payload: { chats } }));
                    } catch (err) {
                        console.error('Ошибка при получении списка чатов:', err);
                        ws.send(JSON.stringify({ type: 'error', message: 'Ошибка при получении списка чатов' }));
                    }
                    break;

                case 'greeting':
                    console.log('Получено приветствие от клиента:', payload);
                    ws.send(JSON.stringify({ type: 'greeting_received', message: 'Приветствие принято' }));
                    break;

                default:
                    console.error('Неизвестный тип сообщения:', type);
                    ws.send(JSON.stringify({ type: 'error', message: 'Неизвестный тип сообщения' }));
            }
        });

        ws.on('close', () => {
            console.log('WebSocket клиент отключен');
            activeConnections.delete(ws);
        });

        ws.on('error', (error) => {
            console.error('Ошибка WebSocket:', error);
        });
    });

    const createChat = async (user1, user2) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const chatResult = await client.query('INSERT INTO chats DEFAULT VALUES RETURNING id');
            const chatId = chatResult.rows[0].id;
            console.log('Создан чат с ID:', chatId);

            await client.query('INSERT INTO chat_participants (chat_id, user_id) VALUES ($1, $2)', [chatId, user1]);
            await client.query('INSERT INTO chat_participants (chat_id, user_id) VALUES ($1, $2)', [chatId, user2]);

            await client.query('COMMIT');
            console.log('Участники добавлены в чат с ID:', chatId);
            return chatId;
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Ошибка при создании чата, откат транзакции:', err);
            throw err;
        } finally {
            client.release();
        }
    };

    const saveMessage = async (chatId, senderId, text) => {
        const client = await pool.connect();
        try {
            await client.query('INSERT INTO messages (chat_id, sender_id, message_text) VALUES ($1, $2, $3)', [chatId, senderId, text]);
            console.log('Сообщение сохранено в базе данных:', { chatId, senderId, text });
        } catch (err) {
            console.error('Ошибка при сохранении сообщения:', err);
            throw err;
        } finally {
            client.release();
        }
    };

    const getChatHistory = async (chatId) => {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM messages WHERE chat_id = $1 ORDER BY sent_at ASC', [chatId]);
            console.log('Получена история сообщений для чата ID:', chatId);
            return result.rows;
        } catch (err) {
            console.error('Ошибка при получении истории сообщений:', err);
            throw err;
        } finally {
            client.release();
        }
    };

    const getChats = async () => {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM chats');
            console.log('Получен список чатов:', result.rows);
            return result.rows;
        } catch (err) {
            console.error('Ошибка при получении списка чатов:', err);
            throw err;
        } finally {
            client.release();
        }
    };

    const broadcastMessage = (wss, chatId, message) => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'new_message', chatId, ...message }));
                console.log('Отправлено сообщение в чат ID:', chatId, message);
            }
        });
    };

    const closeAllConnections = () => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.close();
            }
        });
    };

    return { wss, closeAllConnections };
};

export default createWsServer;
