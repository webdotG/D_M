import WebSocket , {WebSocketServer} from 'ws';

// Создание WebSocket сервера, используя существующий HTTP сервер

const createWsServer = (httpServer) => {
    
    const wss = new WebSocketServer({ server: httpServer });

    wss.on('connection', (ws) => {
        console.log('WebSocket клиент подключен');

        ws.on('message', (message) => {
            console.log('Получено сообщение:', message);
            ws.send('Ответ от WebSocket сервера');
        });

        ws.on('close', () => {
            console.log('WebSocket клиент отключен');
        });
    });

    return wss;
};

export default createWsServer;
