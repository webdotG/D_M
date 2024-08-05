const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:2525'; 

const ws = new WebSocket(wsUrl);

ws.onopen = () => {
    console.log('WebSocket соединение открыто');
    ws.send('Привет от клиента');
};

ws.onmessage = (event) => {
    console.log('Сообщение от сервера:', event.data);
};

ws.onerror = (error) => {
    console.error('Ошибка WebSocket:', error);
};

ws.onclose = () => {
    console.log('WebSocket соединение закрыто');
    // Можете добавить логику для попытки переподключения, если это необходимо
};

export default ws;
