import WebSocket, { WebSocketServer } from 'ws';
import { pool } from './db.js'; // Импорт пула подключений к базе данных

// Создание WebSocket сервера, используя существующий HTTP сервер
const createWsServer = (httpServer) => {
    const wss = new WebSocketServer({ server: httpServer });

    wss.on('connection', (ws) => {
        console.log('WebSocket клиент подключен');

        ws.on('message', async (message) => {
            console.log('Получено сообщение:', message);
            const { type, payload } = JSON.parse(message);

            switch (type) {
                case 'chat_request':
                    // Обработка запроса на создание чата
                    const { user1, user2 } = payload;
                    try {
                        const chatId = await createChat(user1, user2);
                        ws.send(JSON.stringify({ type: 'chat_created', chatId }));
                    } catch (err) {
                        console.error('Ошибка при создании чата:', err);
                        ws.send(JSON.stringify({ type: 'error', message: 'Ошибка при создании чата' }));
                    }
                    break;

                case 'new_message':
                    // Обработка нового сообщения
                    const { chatId: chatIdForMessage, senderId, text } = payload;
                    try {
                        await saveMessage(chatIdForMessage, senderId, text);
                        broadcastMessage(wss, chatIdForMessage, { senderId, text });
                    } catch (err) {
                        console.error('Ошибка при сохранении сообщения:', err);
                        ws.send(JSON.stringify({ type: 'error', message: 'Ошибка при сохранении сообщения' }));
                    }
                    break;

                case 'get_history':
                    // Обработка запроса на получение истории сообщений
                    try {
                        const messages = await getChatHistory(payload.chatId);
                        ws.send(JSON.stringify({ type: 'chat_history', messages }));
                    } catch (err) {
                        console.error('Ошибка при получении истории сообщений:', err);
                        ws.send(JSON.stringify({ type: 'error', message: 'Ошибка при получении истории сообщений' }));
                    }
                    break;

                default:
                    console.error('Неизвестный тип сообщения:', type);
                    ws.send(JSON.stringify({ type: 'error', message: 'Неизвестный тип сообщения' }));
            }
        });

        ws.on('close', () => {
            console.log('WebSocket клиент отключен');
        });

        ws.on('error', (error) => {
            console.error('Ошибка WebSocket:', error);
        });
    });

    // Функция для закрытия всех подключений WebSocket
    const closeAllConnections = () => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.close();
            }
        });
    };

    return { wss, closeAllConnections };
};

// Функция для создания нового чата
const createChat = async (user1, user2) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const chatResult = await client.query('INSERT INTO chats DEFAULT VALUES RETURNING id');
        const chatId = chatResult.rows[0].id;

        await client.query('INSERT INTO chat_participants (chat_id, user_id) VALUES ($1, $2)', [chatId, user1]);
        await client.query('INSERT INTO chat_participants (chat_id, user_id) VALUES ($1, $2)', [chatId, user2]);

        await client.query('COMMIT');
        return chatId;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

// Функция для сохранения нового сообщения
const saveMessage = async (chatId, senderId, text) => {
    const client = await pool.connect();
    try {
        await client.query('INSERT INTO messages (chat_id, sender_id, message_text) VALUES ($1, $2, $3)', [chatId, senderId, text]);
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

// Функция для получения истории сообщений чата
const getChatHistory = async (chatId) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM messages WHERE chat_id = $1 ORDER BY sent_at ASC', [chatId]);
        return result.rows;
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
};

// Функция для трансляции сообщения всем клиентам
const broadcastMessage = (wss, chatId, message) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'new_message', chatId, ...message }));
        }
    });
};

export default createWsServer;
