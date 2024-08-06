import WebSocket, { WebSocketServer } from 'ws';

// Создание WebSocket сервера, используя существующий HTTP сервер
const createWsServer = (httpServer) => {
    // Создаем WebSocket сервер, который будет работать на том же порту, что и HTTP сервер
    const wss = new WebSocketServer({ server: httpServer });

    // Обработка нового подключения клиента
    wss.on('connection', (ws) => {
        console.log('WebSocket клиент подключен');

        // Обработка входящих сообщений от клиента
        ws.on('message', (message) => {
            console.log('Получено сообщение:', message);
            // Отправляем ответ клиенту
            ws.send('Ответ от WebSocket сервера');
        });

        // Обработка закрытия соединения клиента
        ws.on('close', () => {
            console.log('WebSocket клиент отключен');
        });

        // Обработка ошибок соединения
        ws.on('error', (error) => {
            console.error('Ошибка WebSocket:', error);
        });
    });

    // Функция для принудительного закрытия всех соединений
    const closeAllConnections = () => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.close(); // Закрываем соединение с клиентом
            }
        });
    };

    // Возвращаем объект WebSocket сервера и функцию для закрытия соединений
    return { wss, closeAllConnections };
};

export default createWsServer;
